import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { BookingService } from './booking.service';

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
  ],
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
})
export class BookingModule {}
