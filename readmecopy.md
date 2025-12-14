# SalesPilot - Dokumentasi Ringkas

Dokumen ini merangkum overview, setup, dan fitur utama dari seluruh komponen aplikasi SalesPilot: Frontend, Backend, dan Machine Learning.

---

## 1. Frontend
- **Framework:** React (Vite), TailwindCSS, React Router, Recharts
- **Fitur:**
  - Dashboard analitik distribusi leads
  - Tabel data leads, filter, pencarian
  - Detail customer (profil, riwayat kampanye, catatan, call log)
  - Login & manajemen profil
- **Setup:**
  1. `cd frontend`
  2. `npm install`
  3. `npm run dev`
- **Akses:** http://localhost:5173
- **Catatan:**
  - Endpoint API diatur di `src/api/apiClient.js`
  - Pastikan backend berjalan sebelum frontend

---

## 2. Backend
- **Framework:** FastAPI (Python), SQLAlchemy, Pydantic
- **Database:** PostgreSQL (Neon/Railway)
- **Deployment:** Railway (API), Docker support
- **Fitur:**
  - Autentikasi user (JWT dummy)
  - Endpoint leads, detail, catatan, call log
  - Prediksi lead scoring (integrasi ML)
- **Setup:**
  1. `pip install -r backend/requirements.txt`
  2. Copy `.env.example` ke `.env` dan isi variabel
  3. `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Endpoint Utama:**
  - `GET /health` — status
  - `POST /api/auth/login` — login dummy
  - `GET /leads` — list lead
  - `GET /leads/{id}` — detail lead
  - `POST /notes` — tambah catatan
- **Contoh Login:**
  ```json
  {"username": "sales_user_01", "password": "password123"}
  ```

---

## 3. Machine Learning (ML)
- **Model:** XGBoost, pipeline preprocessing, feature engineering
- **Dataset:** Bank Marketing (UCI), 41.188 baris, 21 kolom
- **Imbalance:** 88,7% 'no', 11,3% 'yes'
- **Fitur penting:** indikator ekonomi, status pekerjaan, riwayat kontak
- **Evaluasi:** Akurasi ~86%, metrik lain: precision, recall, f1-score
- **Deployment:** FastAPI endpoint `/predict`
- **Contoh Request:**
  ```json
  {"age": 35, "job": "admin.", ...}
  ```
- **Contoh Response:**
  ```json
  {"probability": 0.23, "prediction": 0}
  ```
- **Setup:**
  1. `cd ml`
  2. `pip install -r requirements.txt`
  3. `uvicorn app:app --host 0.0.0.0 --port 8001`

---

## Tech Stack Ringkas
- **Frontend:** React, Vite, TailwindCSS, Recharts
- **Backend:** FastAPI, SQLAlchemy, Pydantic, Railway, Docker
- **ML:** XGBoost, scikit-learn, pandas, numpy
- **Database:** PostgreSQL (Neon)

---

Lihat README masing-masing folder untuk detail lebih lanjut.
