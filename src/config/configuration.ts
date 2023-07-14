export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nats: {
    server: process.env.NATS || 'nats://localhost:4222',
    queues: {
      pushNotifications: 'push-notifications-rest-service',
    }
  },
  kafka: {
    clientId: 'my-app',
    brokers: [process.env.KAFKA || 'localhost:9092'],
  },
});
