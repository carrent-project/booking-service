import { Controller } from "@nestjs/common";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { BookingService } from './booking.service';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern("booking.say-hi")
  async sayHi() {
    try {
        return await this.bookingService.sayHi()
    } catch(error) {
      console.log("[Booking Microservice] sayHi error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }
}