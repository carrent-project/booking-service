import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BookingCronService {
  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * *')
  async completeExpiredBookings() {
    const now = new Date();
    const result = await this.prisma.booking.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: { lt: now },
      },
      data: { status: 'COMPLETED' },
    });
    if (result.count) {
      console.log(`✅ ${result.count} bookings auto-completed`);
    }
  }
}
