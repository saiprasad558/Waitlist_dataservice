import { Module } from '@nestjs/common';
import { DataService } from './data/data.service';
import { ConfigModule } from '@nestjs/config';
import { WaitListModule } from './waitlist/waitlist.module';
import { DataModule } from './data/data.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    WaitListModule,
    DataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
