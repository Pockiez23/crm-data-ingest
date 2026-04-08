const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function run() {
  await producer.connect();
  console.log('--- Producer connected to Kafka ---');

  // mock data
  const payload = {
    name: 'Somchai Jaidee',
    email: 'somchai.j@example.com',
    phone: '0812345678',
    action: 'REGISTER_NEW_USER'
  };

  await producer.send({
    topic: 'crm.data.insert',
    messages: [
      {
        value: JSON.stringify(payload)
      },
    ],
  });

  console.log('Message sent successfully!');
  console.log(payload);

  await producer.disconnect();
}

run().catch(console.error);
