# สรุปผลการพัฒนา (Walkthrough): CRM Data Ingest

ผมได้ทำการสร้างโครงร่างโปรเจ็ค NestJS สำหรับรับข้อมูลจาก Kafka และบันทึกลง SQL Server ให้เรียบร้อยแล้ว โดยโค้ดทั้งหมดอยู่ที่โฟลเดอร์ `c:\Intern\crm-data-ingest` นอกเหนือจากโค้ดของ NestJS ยังมีไฟล์ตั้งค่า Docker และสคริปต์ทดสอบตามที่ตกลงกันไว้ครับ

## ไฟล์สำคัญที่สร้างขึ้น

1. **Infrastructure**: `docker-compose.yml`
   รัน Kafka, Zookeeper, และ SQL Server (Developer Edition) พร้อมสำหรับการพัฒนา

2. **Core App**: `src/main.ts`, `src/app.module.ts`
   ใน App Module ถูกตั้งค่า TypeORM สำหรับต่อ MSSQL และ `main.ts` ได้ระบุการเชื่อมต่อ Microservice แบบ Kafka Broker บนพอร์ต `9092`

3. **CRM Module**: `src/crm`
   - `crm-data.entity.ts`: Schema จำลอง โดยมีฟิลด์ทั่วไปอย่าง (name, email, phone, action, createdAt) โค้ดนี้จะไปสร้าง Table ชื่อ `CrmDataLogs` ใน SQL Server ให้ตอนรันระบบครั้งแรก (synchronize: true)
   - `crm.controller.ts`: มี Controller ที่ใช้ Decorator `@MessagePattern('crm.data.insert')` เพื่อรับค่าจาก Topic ใน Kafka
   - `crm.service.ts`: ทำหน้าที่เอาข้อมูลที่รับมาไป Save ลง Database

4. **สคริปต์ทดสอบ**: `scripts/producer.js`
   สคริปต์จำลองการดรอป Message เข้า Kafka โดยบรรจุข้อมูลสมมติของ "Somchai" และยิงเข้าไปยัง Topic: `crm.data.insert`

## วิธีการรันโปรเจ็คด้วยตนเอง

เนื่องจากการรัน `npm install` รอกระบวนการค่อนข้างนาน พี่สามารถทำตามขั้นตอนต่อไปนี้ได้เลยครับ:

> [!TIP]
> **1. รัน Infrastructure**
> รันคำสั่งนี้เพื่อเปิดใช้งาน Database และ Kafka
> ```bash
> docker-compose up -d
> ```

> [!IMPORTANT]
> **2. ติดตั้งแพ็กเกจ**
> ```bash
> npm install
> ```

> [!TIP]
> **3. รันเช็ค NestJS**
> รัน NestJS ในโหมด Dev (แอปจะต่อ DB และ Start Consumer อัตโนมัติ):
> ```bash
> npm run start:dev
> ```

> [!NOTE]
> **4. ทดสอบส่งข้อมูล**
> เปิด Terminal อันใหม่แล้วรันสคริปต์ Producer ที่เตรียมไว้ให้ครับ (ถ้าสำเร็จจะเห็น Log ในหน้าจอของ NestJS ว่าข้อมูลเข้า DB แล้ว!):
> ```bash
> node scripts/producer.js
> ```

## สิ่งที่สามารถปรับปรุงต่อได้ในอนาคต
1. **Database Module แยก**: ตอนนี้ผมรวมไว้ใน `app.module.ts` หากในอนาคตมี DB หลายตัว เราค่อยย้ายแยก Module
2. **DTO / Validation**: ปัจจุบัน Controller รับข้อมูลและส่งต่อไปยัง Service ทันที เราสามารถเพิ่มโครงสร้าง DTO เบื้องหน้าเพื่อป้องกันข้อมูลขยะ (Validation) ได้
3. **Kafka Options**: ถ้าข้อมูลมี Volume สูงอาจจะต้องมาจูน `Consumer Group` หรือ `commit` strategy ทีหลังครับ
