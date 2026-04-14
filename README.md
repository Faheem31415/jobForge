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


## ▲ Deploy to Vercel

This repo is now configured for a **single Vercel project** that serves:
- React frontend (static build from `frontend/`)
- Express API as a serverless function at `/api/*`

### 1) Push this repo to GitHub
Make sure your latest changes are pushed.

### 2) Import project in Vercel
- Go to Vercel Dashboard → **Add New Project**
- Import your GitHub repo
- Framework preset can remain auto-detected
- Build settings are taken from `vercel.json`

### 3) Add environment variables in Vercel (Project Settings → Environment Variables)
Backend variables:
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`
- `CLIENT_URLS` (set to your Vercel frontend URL, e.g. `https://your-app.vercel.app`)
- `RATE_LIMIT_MAX` (optional)

Frontend variable:
- `VITE_API_BASE_URL` = `https://your-app.vercel.app`

> `VITE_API_BASE_URL` must point to the same deployed domain so frontend calls `/api/v1/*` correctly.

### 4) Redeploy
After adding env vars, trigger a redeploy from Vercel.

### 5) Verify
- Frontend loads from your Vercel URL
- API health check example: `https://your-app.vercel.app/api/v1/job/get`

