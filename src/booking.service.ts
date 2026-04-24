import { Injectable, HttpException, Inject } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { internalErrorHandler } from "./utils";
import { ClientProxy } from "@nestjs/microservices";
import {
  Booking,
  CarStatus,
  CreateBookingDto,
  EBookingStatus,
  PaginatedBookingResponse,
} from "@carrent/shared";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BookingService {
  constructor(
    @Inject("CARS_SERVICE") private carsClient: ClientProxy,
    private prisma: PrismaService,
  ) {}

  async getBookingList(
    page: number = 1,
    limit: number = 10,
    status?: EBookingStatus
  ): Promise<PaginatedBookingResponse> {
    try {
      const skip = (page - 1) * limit;
      const where = status ? { status } : {}
      const [bookingList, total] = await this.prisma.$transaction([
        this.prisma.booking.findMany({
          skip,
          take: limit,
          orderBy: { endDate: "asc" },
          where,
          select: {
            id: true,
            carId: true,
            userId: true,
            totalPrice: true,
            status: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        this.prisma.booking.count(),
      ]);
      return {
        data: bookingList.map((booking) => ({
          ...booking,
          status: booking.status as EBookingStatus,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during getting booking list:", error);
      throw internalErrorHandler(500, "Getting booking list failed");
    }
  }

  async createBooking(dto: CreateBookingDto, userId: string): Promise<string> {
    try {
      const now = new Date();
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      if (
        isNaN(+startDate) ||
        isNaN(+endDate) ||
        startDate < now ||
        endDate <= startDate
      ) {
        throw internalErrorHandler(400, "date are incorrect");
      }

      const foundCar = await firstValueFrom(
        this.carsClient.send("cars.get-car-by-id", { id: dto.carId }),
      );

      if (!foundCar) {
        throw internalErrorHandler(404, "Car is not found");
      }

      if (foundCar && foundCar.status !== CarStatus.AVAILABLE) {
        throw internalErrorHandler(400, "Car is not available");
      }

      const conflicting = await this.prisma.booking.findFirst({
        where: {
          carId: dto.carId,
          status: {
            in: [
              EBookingStatus.PENDING,
              EBookingStatus.CONFIRMED,
              EBookingStatus.ACTIVE,
            ],
          },
          OR: [
            {
              startDate: { lte: dto.endDate },
              endDate: { gte: dto.startDate },
            },
          ],
        },
      });
      if (conflicting) {
        throw internalErrorHandler(409, "Car already booked for these dates");
      }

      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
      );
      const totalPrice = foundCar.pricePerDay * days * 100;

      const data = {
        ...dto,
        userId,
        totalPrice,
        status: EBookingStatus.PENDING,
      };
      const booking = await this.prisma.booking.create({ data });

      try {
        if (booking) {
          await firstValueFrom(
            this.carsClient.send("cars.update-car-status", {
              id: dto.carId,
              status: CarStatus.RENTED,
            }),
          );
        }
      } catch (error) {
        await this.prisma.booking.delete({ where: { id: booking.id } });
        throw internalErrorHandler(500, "Failed to update car status");
      }

      return booking.id;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during creating booking:", error);
      throw internalErrorHandler(500, "Creating booking failed");
    }
  }

  async removeBooking(id: string): Promise<string> {
    try {
      const foundBooking = await this.prisma.booking.findUnique({
        where: { id },
      });
      if (!foundBooking) {
        throw internalErrorHandler(404, `Booking with id "${id}" is not found`);
      }
      if (
        foundBooking.status !== EBookingStatus.CANCELLED &&
        foundBooking.status !== EBookingStatus.COMPLETED
      ) {
        throw internalErrorHandler(
          400,
          `Impossible to remove booking with status ${foundBooking.status}`,
        );
      }
      await this.prisma.booking.delete({ where: { id } });
      return foundBooking.id;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during removing booking:", error);
      throw internalErrorHandler(500, "Creating removing failed");
    }
  }

  async changeBookingStatus(
    id: string,
    newStatus: EBookingStatus,
    userId: string,
    isAdmin: boolean,
  ): Promise<Booking> {
    try {
      const foundBooking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!foundBooking) {
        throw internalErrorHandler(404, `Booking with id "${id}" is not found`);
      }
      if (!isAdmin && foundBooking.userId !== userId) {
        throw internalErrorHandler(
          403,
          "You are not the owner of this booking",
        );
      }
      if (!isAdmin && newStatus !== EBookingStatus.CANCELLED) {
        throw internalErrorHandler(
          400,
          "User can only cancel their own booking",
        );
      }

      const bookingWithNewStatus = await this.prisma.booking.update({
        where: { id },
        data: { status: newStatus },
      });
      return {
        ...bookingWithNewStatus,
        status: bookingWithNewStatus.status as EBookingStatus,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during changing booking status:", error);
      throw internalErrorHandler(500, "Changing booking status failed");
    }
  }
}
