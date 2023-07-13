import { Module } from '@nestjs/common';
import { WaitListService } from './waitlist.service';
import { NotesController } from './waitlist.controller';
import { DataService } from 'src/data/data.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [NotesController],
  providers: [WaitListService, DataService, ConfigService],
})
export class WaitListModule {}
