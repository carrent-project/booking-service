import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { BookingService } from './booking.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingCronService } from './booking-cron.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CARS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5003,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'REVIEWS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5005,
        },
      },
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [BookingController],
  providers: [BookingCronService, BookingService, PrismaService],
})
export class BookingModule {}
