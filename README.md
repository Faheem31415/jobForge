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

