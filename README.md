# Portfolio Web App
**Tech stack**
- Frontend: React + Vite (JSX)
- Backend: Node.js + Express
- Database: MongoDB
- ORM: Prisma

## โครงสร้าง
```
frontend/   # React + Vite (build & deploy ขึ้น Vercel)
backend/    # Node.js + Express (deploy ขึ้น Render)
.github/workflows/   # GitHub Actions CI/CD
```

## CI/CD (GitHub Actions)
มี workflow อยู่ใน `.github/workflows/`:
- **`ci.yml`** — ทุก push/pull-request จะตรวจ build ว่า backend ผ่าน syntax check และ frontend build ไม่ error
- **`deploy.yml`** — ทุก push ขึ้น `main` จะ build frontend แล้ว deploy ขึ้น Vercel และ trigger deploy backend ขึ้น Render

### Secrets ที่ต้องตั้งใน GitHub (Settings → Secrets and variables → Actions)
| Secret key | คำอธิบาย |
|---|---|
| `VITE_BACKEND_ORIGIN` | URL ของ backend เช่น `https://xxxx.onrender.com` (ใช้ตอน build frontend) |
| `VERCEL_TOKEN` | Token ของ Vercel CLI |
| `VERCEL_ORG_ID` | ดูจาก `npx vercel link` → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | ดูจาก `npx vercel link` → `.vercel/project.json` |
| `RENDER_API_KEY` | Render dashboard → Account → API Keys |
| `RENDER_BACKEND_SERVICE_ID` | ID ของ service (รูปแบบ `srv-...`) |

> ถ้ายังไม่ตั้ง secrets ตัวไหน workflow ที่เกี่ยวข้องจะถูกข้าม (ใช้ `if:` ตรวจ) แต่ก็แนะนำให้ตั้งให้ครบเพื่อ deploy อัตโนมัติ

## Environment variables
ค่าจริงใส่ใน `.env` (ห้าม push ขึ้น git — `.gitignore` กันไว้แล้ว) ดูชื่อตัวแปรได้จาก `.env.example`

- **backend/.env.example** → `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*` , `ADMIN_*`
- **frontend/.env.example** → `VITE_BACKEND_ORIGIN` (URL ของ backend ที่จะเรียก)
  - สร้าง workflow ที่ "env" ในส่วน frontend ใช้ `VITE_BACKEND_ORIGIN` จาก secret ตอน build

### Deploy ด้วยมือ (local)
```bash
# backend (Render)
cd backend
npm install
npx prisma generate
npm start

# frontend (Vercel) — ระบุ URL ของ backend ตอน build
cd frontend
npm install
VITE_BACKEND_ORIGIN=https://<render-url> npm run build
npx vercel --prod
```
