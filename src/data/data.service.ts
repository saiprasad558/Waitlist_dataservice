import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { WaitListEntity } from './enities';
import { ConfigService } from '@nestjs/config';
const slots = [
  '09:30-09:50',
  '09:50-10:10',
  '10:10-10:30',
  '10:30-10:50',
  '10:50-11:10',
  '11:10-11:30',
  '11:30-11:50',
  '11:50-12:10',
  '12:10-12:30',
  '12:30-12:50',
  '12:50-13:10',
  '13:10-13:30',
  '13:30-13:50',
  '13:50-14:10',
  '14:10-14:30',
  '14:30-14:50',
  '14:50-15:10',
  '15:10-15:30',
  '15:30-15:50',
  '15:50-16:10',
  '16:10-16:30',
  '16:30-16:50',
];
@Injectable()
export class DataService {
  private kafka: Kafka;
  static waitlist: Record<string, WaitListEntity> = {};
  static appointment: Record<string, WaitListEntity> = {};

  constructor(private readonly _configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this._configService.get<string>('kafka.clientId'),
      brokers: this._configService.get<string[]>('kafka.brokers'),
    });
  }

  async loadAppointment() {
    const waitlist =  Object.values(DataService.waitlist)
      .filter((waitlist) => waitlist.isExist)
      .map( (waitlist) => {
        const isAppointmentAvailable =  this.findSlots({
          doctorId: waitlist.doctorId,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
        });
        console.log({ isAppointmentAvailable });
        if (isAppointmentAvailable) {
          return waitlist;
        }
      });
    console.log({ waitlist });
  }

  findSlots(query: { doctorId?: string; date?: Date }) {
    const { date, doctorId } = query;

    const doctorslots = Object.values(DataService.appointment)
      .filter(
        (appointment) =>
          appointment.doctorId === doctorId &&
          appointment.appointmentDate === date.toISOString().split('T')[0],
      )
      .map((slot) => slot.slotTime);
    const appointmentavaialbilty = slots.filter(
      (slot) => !doctorslots.includes(slot),
    );
    return appointmentavaialbilty.length > 0;
  }
  async loadData() {
    await this.loadWaitList();
    await this.loadAppointments();
  }

  async loadWaitList() {
    const topicName = 'waitlist';
    const consumerGroupId = 'waitlist-consumer';

    const consumer = this.kafka.consumer({
      groupId: consumerGroupId,
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: topicName,
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = JSON.parse(message.value.toString('utf8'));
        const [operation, id] = message.key.toString().split('#');
        switch (operation) {
          case 'create':
            DataService.waitlist[id] = {
              ...value,
            };
            break;
          case 'update':
            if (DataService.waitlist[id]) {
              DataService.waitlist[id] = {
                ...DataService.waitlist[id],
                ...value,
              };
            }
            break;
          case 'delete':
            delete DataService.waitlist[id];
            break;
          default:
            console.log('Unknown operation', operation);
            break;
        }
      },
    });

    consumer.seek({
      topic: topicName,
      partition: 0,
      offset: '0',
    });
  }

  async loadAppointments() {
    const topicName = 'appointment';
    const consumerGroupId = 'appointment-consumer-group';

    const consumer = this.kafka.consumer({
      groupId: consumerGroupId,
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: topicName,
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = JSON.parse(message.value.toString('utf8'));
        const [operation, id] = message.key.toString().split('#');
        switch (operation) {
          case 'create':
            DataService.appointment[id] = {
              ...value,
            };
            break;
          case 'update':
            if (DataService.appointment[id]) {
              DataService.appointment[id] = {
                ...DataService.appointment[id],
                ...value,
              };
            }
            break;
          case 'delete':
            delete DataService.appointment[id];
            break;
          default:
            console.log('Unknown operation', operation);
            break;
        }
      },
    });

    consumer.seek({
      topic: topicName,
      partition: 0,
      offset: '0',
    });
  }
}
