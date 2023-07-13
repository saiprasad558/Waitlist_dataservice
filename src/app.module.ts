import { Module } from '@nestjs/common';
import { DataService } from './data/data.service';
import { ConfigModule } from '@nestjs/config';
import { WaitListModule } from './waitlist/waitlist.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    WaitListModule,
  ],
  controllers: [],
  providers: [DataService],
})
export class AppModule {}
