import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrmData } from './entities/crm-data.entity';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(CrmData)
    private readonly crmDataRepository: Repository<CrmData>,
  ) {}

  async saveData(data: any): Promise<CrmData> {
    // กำหนดโครงสร้างข้อมูลตามที่รับเข้ามา ถ้าฟิลด์ไหนไม่มีก็ให้เป็น null หรือ undefiend ไปก่อน
    const newData = this.crmDataRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      action: data.action,
    });
    
    return await this.crmDataRepository.save(newData);
  }
}
