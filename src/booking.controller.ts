import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { BookingService } from './booking.service';
import { CreateBookingDto } from '@carrent/shared';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern("booking.get-booking-list")
  async getBookingList() {
    try {
      return await this.bookingService.getBookingList()
    } catch(error) {
      console.log("[Booking Microservice] Getting booking list error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("booking.create-booking")
  async createBooking(@Payload() data: { dto: CreateBookingDto, userId: string }) {
    try {
      return await this.bookingService.createBooking(data.dto, data.userId)
    } catch(error) {
      console.log("[Booking Microservice] Creating booking error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }
}