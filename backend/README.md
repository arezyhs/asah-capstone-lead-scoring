# SalesPilot Backend

Backend API untuk aplikasi lead scoring SalesPilot. Menyediakan layanan autentikasi, manajemen data leads, catatan sales, dan integrasi prediksi machine learning.

---

## Overview
- Framework: FastAPI (Python)
- Database: PostgreSQL (Neon/Railway)
- Deployment: Railway (API), Vercel (frontend), Neon (DB)
- Containerization: Docker
- Model ML: XGBoost (integrasi via modul inference)

## Fitur Utama
- Autentikasi user (JWT dummy, siap dikembangkan)
- Endpoint data leads, detail, catatan, call log
- Prediksi lead scoring (integrasi ML)
- Health check & monitoring uptime
- CORS support untuk frontend (Vercel, Netlify, localhost)

## Struktur Folder
- `app/` : kode utama FastAPI (endpoints, models, schemas, auth, inference)
- `models/` : artefak model ML (pkl)
- `deployment/` : Dockerfile, railway.json
- `backend/requirements.txt` : dependensi Python

## Setup & Instalasi Lokal
1. Clone repo & masuk ke root project
2. Buat dan aktifkan virtualenv (opsional)
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Copy `.env.example` ke `.env` dan isi variabel (DATABASE_URL, dsb)
5. Jalankan server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## Deployment
- **Railway:**
  - Otomatis build & deploy via railway.json
  - Health check: `/health`
- **Docker:**
  - Build image: `docker build -t salespilot-backend .`
  - Run: `docker run -p 8000:8000 salespilot-backend`

## Environment Variables
- `DATABASE_URL` : URL koneksi PostgreSQL (Neon/Railway)
- `PORT` : port server (default 8000)
- `DEBUG` : true/false

## Endpoint Utama
- `GET /health` : status API
- `POST /api/auth/login` : login dummy
- `GET /leads` : list leads
- `GET /leads/{id}` : detail lead
- `POST /notes` : tambah catatan

## Contoh Request Login
```json
{
  "username": "sales_user_01",
  "password": "password123"
}
```

## Tech Stack
- fastapi, uvicorn, sqlalchemy, psycopg2-binary
- xgboost, pandas, numpy, joblib
- pydantic, python-multipart

## Catatan
- Model ML di-load otomatis dari folder `models/`
- Untuk pengujian, gunakan kredensial dummy di atas
- Pastikan database sudah tersedia dan terhubung

---

Dokumentasi ini merangkum arsitektur dan setup backend SalesPilot. Lihat juga dokumentasi API di `docs/API.md` untuk detail endpoint.