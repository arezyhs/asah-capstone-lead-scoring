# SalesPilot

Aplikasi lead scoring untuk memprioritaskan prospek dengan potensi konversi tertinggi. Capstone Dicoding (Case AC-03) — Tim A25-CS065.

## Tim
- Akbar Rezy Hanara S (R284D5Y0128) — React & Backend with AI
- Ahmad Misbach (R284D5Y0099) — React & Backend with AI
- Bram Prastyo Nugroho (R284D5Y0364) — React & Backend with AI
- Augie Bryan Athalla (M296D5Y0308) — Machine Learning
- Fayzul Haq (M284D5Y0624) — Machine Learning

## Ringkasan
- Prediksi probabilitas konversi dengan XGBoost (akurasi ~89%)
- Dashboard: distribusi lead (job, usia, education, marital)
- Detail lead: profil demografis/finansial, riwayat kampanye, catatan sales, call log
- Performance: KPI user, conversion rate, aktivitas call

## Tech Stack
- Frontend: React + Vite, TailwindCSS, React Router, Recharts (deploy: Vercel)
- Backend: FastAPI (Python 3.13), SQLAlchemy, psycopg, Pydantic (deploy: Railway)
- ML: XGBoost, scikit-learn; dataset Bank Marketing
- Database: PostgreSQL (Neon)

## Quickstart
```bash
git clone https://github.com/arezyhs/asah-capstone-lead-scoring.git

# Backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Endpoint Ringkas
- GET /health — status
- POST /api/auth/login — login dummy
- GET /leads — list lead
- GET /leads/{id} — detail lead
- POST /notes — tambah catatan

## Akses
- Prod: https://asah-capstone-frontend.vercel.app/login

## Kredensial Uji
- Username: `sales_user_01`
- Password: `password123`

## Lisensi
Capstone Project Dicoding A25-CS065.

---

**Dikembangkan oleh Tim A25-CS065 - Dicoding Asah Capstone Bootcamp**
