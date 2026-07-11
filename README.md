# Portfolio Web App

เว็บพอร์ตโฟลิโอ พร้อมหน้า Admin สำหรับจัดการ Skill / Language / Image

**Tech stack**
- Frontend: React + Vite (JSX)
- Backend: Node.js + Express
- Database: MongoDB
- ORM: Prisma

## โครงสร้างโปรเจกต์
```
portfolio-app/
├── backend/     # Express API + Prisma
└── frontend/    # React (Vite)
```

## หน้าเว็บที่มี
- **หน้าหลัก (Home)**: section รูปภาพ (Gallery), Skill จัดกลุ่มตาม category ที่พิมพ์เอง (Frontend, Backend, Database, Tool, Cyber, Graphic Design, Excel ฯลฯ) พร้อม badge ระดับ (Basic / Advanced / Expert หรือไม่ระบุก็ได้), Language พร้อม badge ระดับ (Basic / Advanced / Native หรือไม่ระบุก็ได้)
- **About**: ข้อมูลเกี่ยวกับเว็บ
- **Contact**: ช่องทางติดต่อ
- **Login**: กรอกแค่ username / password
- **Admin** (ต้อง login ก่อน): เพิ่ม/ลบ/แก้ไข Skill (name + category + level แบบเลือกได้ว่าจะใส่หรือไม่), Language (name + level แบบเลือกได้ว่าจะใส่หรือไม่), Image (**upload ไฟล์จากเครื่องโดยตรง** ไม่ต้องกรอก URL)

---

## 1) ติดตั้ง MongoDB

Prisma ต้องใช้ MongoDB ที่เป็น **replica set** (แม้จะรันเครื่องเดียว) วิธีที่ง่ายที่สุดคือใช้
[MongoDB Atlas](https://www.mongodb.com/atlas) (ฟรี) แล้วคัดลอก connection string มาใส่ใน `.env`

## 2) ตั้งค่า Backend

```bash
cd backend
cp .env.example .env
# แก้ไขค่าใน .env: DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET

npm install
npx prisma generate
npx prisma db push     # สร้าง collection ตาม schema ใน MongoDB
npm run dev            # รันที่ http://localhost:4000
```

## 3) ตั้งค่า Frontend

```bash
cd frontend
npm install
npm run dev             # รันที่ http://localhost:5173
```

Vite ตั้ง proxy ให้ `/api` วิ่งไปที่ `http://localhost:4000` แล้ว (ดูใน `vite.config.js`)
ดังนั้นตอน dev ไม่ต้องแก้ base URL ใดๆ

## 4) เข้าใช้งาน

1. เปิด http://localhost:5173
2. ไปที่หน้า **Login** แล้ว login ด้วยค่าที่ตั้งไว้ใน `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`)
3. เข้าไปที่หน้า **Admin** เพื่อเพิ่ม Skill, Language, Image
4. ข้อมูลที่เพิ่มจะไปแสดงที่หน้า Home ทันที

## API Endpoints (backend)

| Method | Endpoint              | Auth | คำอธิบาย                |
|--------|------------------------|------|--------------------------|
| POST   | /api/auth/login        | -    | Login ด้วย username/password, คืน JWT token |
| GET    | /api/skills            | -    | ดึงรายการ skill ทั้งหมด (name, category, level) |
| POST   | /api/skills            | ✅   | เพิ่ม skill: `{ name, category, level? }` (level: "basic" \| "advanced" \| "expert" \| ไม่ส่ง/null) |
| PUT    | /api/skills/:id        | ✅   | แก้ไข skill              |
| DELETE | /api/skills/:id        | ✅   | ลบ skill                 |
| GET    | /api/languages         | -    | ดึงรายการ language (name, level) |
| POST   | /api/languages         | ✅   | เพิ่ม language: `{ name, level? }` (level: "basic" \| "advanced" \| "native" \| ไม่ส่ง/null) |
| PUT    | /api/languages/:id     | ✅   | แก้ไข language           |
| DELETE | /api/languages/:id     | ✅   | ลบ language              |
| GET    | /api/images            | -    | ดึงรายการรูปภาพ (url เป็น path เช่น `/uploads/xxx.jpg`) |
| POST   | /api/images            | ✅   | อัปโหลดรูป: `multipart/form-data` field `image` (ไฟล์) + `caption` (ข้อความ) |
| PUT    | /api/images/:id        | ✅   | แก้ไขรูป (เปลี่ยนไฟล์ และ/หรือ caption) แบบ `multipart/form-data` |
| DELETE | /api/images/:id        | ✅   | ลบรูป (ลบไฟล์จริงในดิสก์ด้วย)   |

`✅` = ต้องแนบ header `Authorization: Bearer <token>` ที่ได้จากการ login

## หมายเหตุ
- ระบบ login เป็นแบบง่าย (username/password เทียบกับค่าใน `.env`) ตามที่ระบุไว้ — ไม่มีตาราง User ใน DB
  ถ้าต้องการหลาย user จริงๆ ค่อยเพิ่ม model User ใน Prisma schema ภายหลังได้
- **Skill category** เป็นข้อความอิสระ (ไม่ได้ fix เป็น enum) พิมพ์เองได้เลย เช่น "Frontend", "Backend",
  "Database", "Tool", "Cyber", "Graphic Design", "Word", "Excel" — หน้า Admin จะโชว์ category ที่เคยพิมพ์
  ไว้เป็น suggestion (datalist) ให้เลือกซ้ำได้ง่ายขึ้น
- **Level ของ skill/language เป็น optional** ถ้าไม่ติ๊ก "ระบุระดับ" ตอนเพิ่ม/แก้ไข ค่า level จะเป็น `null`
  และหน้า Home จะไม่แสดง badge ระดับให้ (โชว์แค่ชื่อ)
- **รูปภาพเก็บเป็นไฟล์บนเซิร์ฟเวอร์จริง** อัปโหลดจากเครื่องผ่านหน้า Admin (ไม่ต้องกรอก URL) ไฟล์จะถูกเก็บไว้ที่
  `backend/uploads/` และเสิร์ฟผ่าน `http://localhost:4000/uploads/...` (ตอน dev มี proxy ให้แล้วใน
  `vite.config.js`) จำกัดขนาดไฟล์ไม่เกิน 5MB และรับเฉพาะไฟล์รูปภาพเท่านั้น
