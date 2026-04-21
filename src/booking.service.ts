import { Injectable, HttpException } from "@nestjs/common";
import { PrismaService } from './prisma.service';
import { internalErrorHandler } from './utils';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async sayHi() {
    try {
      return 'Hello, im booking'
    } catch(error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during sayHi:", error);
      throw internalErrorHandler(500, "sayHi failed");
    }
  }
}