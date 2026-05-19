import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookingModule } from './app.module';

async function booking() {
  const PORT = process.env.PORT;
  const port = PORT ? +PORT : 5004;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port,
      },
    },
  );

  await app.listen();
  console.log(`🚀 booking microservice is listening on port ${port}`);
}
booking();