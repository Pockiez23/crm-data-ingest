import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // สร้างแอปปกติสำหรับใช้งาน HTTP ทั่วไป
  const app = await NestFactory.create(AppModule);

  // เชื่อมต่อเป็น Microservice เข้ากับ Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // ติดต่อไปยัง Kafka Broker
      },
      consumer: {
        groupId: 'crm-consumer-group', // Consumer Group
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('CRM Data Ingest application is running on: http://localhost:3000');
  console.log('Kafka Consumer is listening...');
}
bootstrap();
