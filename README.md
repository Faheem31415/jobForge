# Job Portal - Full Stack App

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT, Cloudinary, Multer
- **Frontend**: React, Vite, Redux Toolkit, Tailwind CSS, Radix UI

## 🚀 Quick Start

### Prerequisites
- Node.js (18+)
- MongoDB Atlas account (free): https://mongodb.com/atlas
- Cloudinary account (free): https://cloudinary.com

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: Add MongoDB Atlas URI, JWT_SECRET, Cloudinary creds
npm run dev
```
**Expected**: `Server running at port 3000` + `mongodb connected successfully`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
**Expected**: App opens at http://localhost:5173 (auto-proxy to backend)



## ▲ Deploy to Vercel (Frontend and Backend Separately)

Deploy as **two different Vercel projects**:
- `backend/` → API project
- `frontend/` → web app project

### 1) Deploy Backend (`backend/`)
1. In Vercel, click **Add New Project** and import the same repo.
2. Set **Root Directory** to `backend`.
3. Add backend environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUD_NAME`
   - `API_KEY`
   - `API_SECRET`
   - `CLIENT_URLS` (set this after frontend is deployed; you can use localhost first)
   - `RATE_LIMIT_MAX` (optional)
4. Deploy and copy the backend URL (example: `https://jobforge-api.vercel.app`).

> Backend routing is configured by `backend/vercel.json`, and requests are served by `backend/api/index.js`.

### 2) Deploy Frontend (`frontend/`)
1. Create another Vercel project from the same repo.
2. Set **Root Directory** to `frontend`.
3. Add frontend environment variable:
   - `VITE_API_BASE_URL` = your backend URL (example: `https://jobforge-api.vercel.app`)
4. Deploy the frontend project.

> SPA routing fallback is configured by `frontend/vercel.json`.

### 3) Final CORS Update
After frontend deploys, go back to backend project env vars and set:
- `CLIENT_URLS=https://your-frontend.vercel.app`

Then redeploy backend once.

### 4) Verify
- Frontend loads from frontend URL.
- Frontend network requests hit backend URL + `/api/v1/*`.
- Test API directly: `https://your-backend.vercel.app/api/v1/job/get`
