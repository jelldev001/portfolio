# Portfolio Web App
**Tech stack**
- Frontend: React + Vite (JSX)
- Backend: Node.js + Express
- Database: MongoDB
- ORM: Prisma

## โครงสร้าง
```
frontend/   # React + Vite (build & deploy ขึ้น Cloudflare Pages)
backend/    # Node.js + Express (deploy ขึ้น Render)
.github/workflows/   # GitHub Actions CI/CD
```

## CI/CD (GitHub Actions)
มี workflow อยู่ใน `.github/workflows/`:
- ปัจจุบันยังไม่มี workflow สำหรับตรวจ CI แยกต่างหาก
- **`deploy.yml`** — ทุก push ขึ้น `main` จะ build frontend แล้ว deploy ขึ้น Cloudflare Pages และ trigger deploy backend ขึ้น Render เมื่อมีการเปลี่ยนไฟล์ในแต่ละโฟลเดอร์

### Secrets ที่ต้องตั้งใน GitHub (Settings → Secrets and variables → Actions)
| Secret key | คำอธิบาย |
|---|---|
| `CLOUDFLARE_API_TOKEN` | API token ที่มีสิทธิ์ deploy Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID จาก Cloudflare dashboard |
| `VITE_BACKEND_ORIGIN` | URL ของ backend บน Render เช่น `https://xxxx.onrender.com` (ไม่ต้องมี `/` ปิดท้าย) |
| `RENDER_DEPLOY_HOOK_URL` | Deploy Hook URL ของ backend service จาก Render dashboard |

> ตั้ง secrets ทั้งหมดข้างต้นใน GitHub ก่อน push ขึ้น `main`; frontend build ใช้ `VITE_BACKEND_ORIGIN` เพื่อฝัง URL ของ Render API ลงในเว็บ

## Environment variables
ค่าจริงใส่ใน `.env` (ห้าม push ขึ้น git — `.gitignore` กันไว้แล้ว) ดูชื่อตัวแปรได้จาก `.env.example`

- **backend/.env.example** → `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*` , `ADMIN_*`
- **frontend/.env.example** → `VITE_BACKEND_ORIGIN` (URL ของ backend ที่จะเรียก)
  - สร้าง workflow ที่ "env" ในส่วน frontend ใช้ `VITE_BACKEND_ORIGIN` จาก secret ตอน build

### Deploy ด้วยมือ
```bash
# frontend: build แล้ว deploy โฟลเดอร์ frontend/dist ไป Cloudflare Pages
cd frontend
npm ci
VITE_BACKEND_ORIGIN=https://<render-url> npm run build
npx wrangler pages deploy dist --project-name=portfolio
```

Backend ยังคง deploy บน Render โดย Render ใช้ `backend` เป็น Root Directory และ `npm start` เป็น Start Command
