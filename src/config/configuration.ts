export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  natsUrl: process.env.NATS || 'nats://localhost:4222',
  kafka: {
    clientId: 'my-app',
    brokers: [process.env.KAFKA || 'localhost:9092'],
  },
});
