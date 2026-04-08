import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { CrmData } from './entities/crm-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrmData])],
  controllers: [CrmController],
  providers: [CrmService],
})
export class CrmModule { }
