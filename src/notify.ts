import { Kafka, Partitioners } from 'kafkajs';
import { v4 } from 'uuid';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['34.170.91.100:29092' || 'localhost:9092'],
});

export async function notification(request: any) {
  try {
    if (!request) {
      throw new Error('invalid-inputs');
    }
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    await producer.connect();
    const key = v4();
    const outgoingMessage = {
      key: `create#${key}`,
      value: JSON.stringify({
        ...request,
        createdAt: new Date().toISOString(),
        isViewed: false,
        id: key,
      }),
    };
    await producer.send({
      topic: 'notifications',
      messages: [outgoingMessage],
    });
    console.log('notify sent', request.notificationId);
    return {
      status: 201,
      body: request,
    };
  } catch (error: any) {
    console.error(error);
    if (error.toString().match('invalid-inputs')) {
      return {
        status: 422,
        body: {
          message: 'Invalid request',
        },
      };
    }

    return {
      status: 404,
      body: {
        message: 'something went wrong',
      },
    };
  }
}
