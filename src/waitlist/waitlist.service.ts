import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';


@Injectable()
export class WaitListService {
  findAll(query: { patientId?: string; doctorId?: string }) {
    const { patientId, doctorId } = query;
    return Object.values(DataService.waitlist).filter(
      (waitlist) =>
        (!patientId || waitlist.patientId === patientId) &&
        (!doctorId || waitlist.doctorId === doctorId) &&
        waitlist.isExist,
    );
  }

  findOne(id: number) {
    return DataService.waitlist[id];
  }


 



}
