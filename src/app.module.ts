import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmModule } from './crm/crm.module';
import { CrmData } from './crm/entities/crm-data.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql', // ใช้งาน SQL Server
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: '12345',
      database: 'crm-database', // ช่วงแรกใช้ crm-database ไปก่อน เพราะยังไม่ได้ระบุ
      entities: [CrmData],
      synchronize: true,
      options: {
        encrypt: true,
        trustServerCertificate: true, // มองข้ามการตรวจสอบ SSL
      },
      extra: {
        trustServerCertificate: true,
      }
    }),
    CrmModule,
  ],
})
export class AppModule { }
