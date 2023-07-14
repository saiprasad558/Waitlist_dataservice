import { Module } from '@nestjs/common';
import { WaitListService } from './waitlist.service';
import { NotesController } from './waitlist.controller';
import { DataService } from 'src/data/data.service';
import { ConfigService } from '@nestjs/config';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  controllers: [NotesController],
  providers: [WaitListService],
})
export class WaitListModule {}
