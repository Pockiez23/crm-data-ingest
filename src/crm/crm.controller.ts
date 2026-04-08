import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CrmService } from './crm.service';

@Controller()
export class CrmController {
  constructor(private readonly crmService: CrmService) { }

  // รับข้อมูลจาก Topic 'crm.data.insert' ของ Kafka
  @MessagePattern('crm.data.insert')
  async handleDataInsert(@Payload() message: any) {
    console.log('--- Received Kafka Message ---');
    console.log(message);

    // Type validation or casting สามารถทำตรงนี้ถ้าจำเป็น
    const savedData = await this.crmService.saveData(message);
    console.log(`Saved successfully to DB (ID: ${savedData.id})`);
  }
}
