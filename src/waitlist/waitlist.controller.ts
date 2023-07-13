import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WaitListService } from './waitlist.service';

@Controller()
export class NotesController {
  constructor(private readonly waitListService: WaitListService) {}

  @MessagePattern('findAllWaitList')
  findAll(@Payload() query: { patientId?: string; doctorId?: string }) {
    return this.waitListService.findAll(query);
  }

  @MessagePattern('findOneWaitList')
  findOne(@Payload() id: number) {
    return this.waitListService.findOne(id);
  }
}
