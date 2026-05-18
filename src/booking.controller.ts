import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { BookingService } from "./booking.service";
import { CreateBookingDto, EBookingStatus } from "@carrent/shared";

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern("booking.get-booking-list")
  async getBookingList(@Payload() data: { page: number; limit: number, status?: EBookingStatus }) {
    try {
      return await this.bookingService.getBookingList(data.page, data.limit, data.status);
    } catch (error: any) {
      console.log("[Booking Microservice] Getting booking list error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("booking.create-booking")
  async createBooking(
    @Payload() data: { dto: CreateBookingDto; userId: string },
  ) {
    try {
      return await this.bookingService.createBooking(data.dto, data.userId);
    } catch (error: any) {
      console.log("[Booking Microservice] Creating booking error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("booking.remove-booking-by-id")
  async removeBooking(@Payload() data: { id: string }) {
    try {
      return await this.bookingService.removeBooking(data.id);
    } catch (error: any) {
      console.log("[Booking Microservice] Removing booking error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("booking.change-booking-status")
  async changeBookingStatus(
    @Payload()
    data: {
      id: string;
      newStatus: EBookingStatus;
      userId: string;
      isAdmin: boolean;
    },
  ) {
    try {
      return await this.bookingService.changeBookingStatus(data.id, data.newStatus, data.userId, data.isAdmin)
    } catch(error: any) {
      console.log("[Booking Microservice] Changing booking status error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("booking.update-status")
  async updateStatusAfterPayment(@Payload() data: { bookingId: string; status: string }) {
    try {
      return await this.bookingService.updateStatusAfterPayment(data.bookingId, data.status)
    } catch(error: any) {
      console.log("[Booking Microservice] Updating booking status after payment error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }
}
