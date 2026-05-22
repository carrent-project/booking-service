import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Cron } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BookingCronService {
  constructor(
    @Inject("CARS_SERVICE") private carsClient: ClientProxy,
    private prisma: PrismaService,
  ) {}

  @Cron("0 0 * * *")
  async completeExpiredBookings() {
    const now = new Date();
    // Находим бронирования, которые нужно завершить
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: "ACTIVE",
        endDate: { lt: now },
      },
      select: { id: true, carId: true },
    });
    if (expiredBookings.length === 0) return;

    // Обновляем их статус
    await this.prisma.booking.updateMany({
      where: { id: { in: expiredBookings.map((b) => b.id) } },
      data: { status: "COMPLETED" },
    });

    // Для каждого автомобиля обновляем статус
    for (const booking of expiredBookings) {
      try {
        await firstValueFrom(
          this.carsClient.send("cars.update-car-status", {
            id: booking.carId,
            status: "AVAILABLE",
          }),
        );
      } catch (err) {
        console.error(`Failed to update car ${booking.carId} status:`, err);
      }
    }
    console.log(
      `✅ ${expiredBookings.length} bookings auto-completed and cars set to AVAILABLE`,
    );
  }
}
