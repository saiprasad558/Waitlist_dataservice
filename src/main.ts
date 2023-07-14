import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DataService } from './data/data.service';
import * as cron from 'node-cron';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS || 'nats://localhost:4222'],
        queue: 'waitlist-data-service',
      },
    },
  );
  const dataService = app.get(DataService);
  await dataService.loadData();
  await app.listen();

  console.log('Microservice is listening');
  cron.schedule('0 0 * * *', async () => {
    await dataService.loadAppointment();
    console.log('Waitlist is queued');
  });
}
bootstrap().catch((err) => console.error(err));
