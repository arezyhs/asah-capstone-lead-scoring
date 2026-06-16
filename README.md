<div align="center">

# SalesPilot - Aplikasi Lead Scoring Berbasis AI

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-blue?style=for-the-badge&logo=xgboost&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

SalesPilot adalah aplikasi *lead scoring end-to-end* yang membantu tim sales dalam memprioritaskan prospek dengan potensi konversi tertinggi. Aplikasi ini dikembangkan sebagai *Capstone Project* (Case AC-03) dari program **Dicoding Asah Capstone Bootcamp**.

Berbeda dengan CRM tradisional, SalesPilot mengintegrasikan pemodelan *Machine Learning* (XGBoost) untuk memprediksi probabilitas konversi setiap *lead*. Hal ini membantu memaksimalkan efektivitas kampanye, memantau metrik performa, dan mencatat riwayat interaksi secara langsung dalam satu platform yang terpusat.

---

## 📸 Tangkapan Layar Aplikasi

<div align="center">
  <!-- Tambahkan screenshot aplikasi di dalam folder docs/screenshots/ -->
  <!-- <img src="docs/screenshots/Dashboard.png" alt="Dashboard" width="48%" style="border-radius: 8px; border: 1px solid #37352f20;"> -->
  <p><i>(Tangkapan layar dapat ditambahkan di sini)</i></p>
</div>

---

## 🚀 Live Demo

- **Aplikasi Web**: [Kunjungi SalesPilot di Vercel](#) *(Ganti dengan link Vercel aktual jika ada)*
- **API Endpoint Utama**: `GET /health` (Status API), `POST /predict` (Inference ML).
- **Kredensial Uji**:
  - Username: `sales_user_01`
  - Password: `password123`

---

## ✨ Fitur Aplikasi

### 📊 Dashboard & Analitik
- **Monitoring KPI**: Memantau *conversion rate*, aktivitas panggilan, dan performa pengguna secara langsung.
- **Distribusi Leads**: Analitik mendalam mengenai distribusi prospek berdasarkan pekerjaan, usia, tingkat edukasi, dan status pernikahan (*marital status*).

### 🎯 Manajemen Lead & Prioritas
- **Prediksi Konversi Berbasis AI**: Menampilkan probabilitas konversi untuk setiap *lead* menggunakan model *Machine Learning* (XGBoost), sehingga tim sales dapat fokus pada *lead* dengan skor tinggi.
- **Profil Detail**: Menampilkan informasi lengkap *lead*, mulai dari profil demografis, kondisi finansial, hingga riwayat kampanye.

### 📝 Aktivitas & Kolaborasi
- **Riwayat Interaksi**: Fitur pencatatan catatan tim sales (*sales notes*) dan *call log* untuk melacak setiap tahapan komunikasi dengan prospek.

---

## ⚙️ Arsitektur & Teknologi

Aplikasi ini menggunakan pendekatan arsitektur terpisah (*decoupled architecture*):

1. **Frontend (Di-deploy ke Vercel)** 
   - Dibuat menggunakan **React 18** dan *bundler* **Vite**.
   - Pendekatan desain antarmuka menggunakan **TailwindCSS** untuk *styling* yang responsif dan cepat, dipadukan dengan **Recharts** untuk visualisasi data interaktif.
   - Menggunakan **React Router** untuk navigasi halaman (*Single Page Application*).

2. **Backend & Machine Learning (Di-deploy ke Railway)**
   - Berbasis **FastAPI** (Python 3.13) untuk menyajikan REST API berkinerja tinggi, divalidasi menggunakan **Pydantic**.
   - Pemodelan analitik prediktif ditenagai oleh **XGBoost** dan **scikit-learn** (juga memuat `pandas` dan `numpy`), disajikan langsung melalui antarmuka API.
   - Menggunakan basis data **PostgreSQL** (didukung oleh Neon/Railway) yang dikelola dengan ORM **SQLAlchemy**.
   - Dilengkapi dengan *Dockerfile* untuk kontainerisasi dan kemudahan *deployment*.

---

## 📖 Dokumentasi Teknis Lanjutan

Untuk mempelajari lebih lanjut tentang arsitektur setiap modul, silakan baca dokumentasi rinci dan berkas pendukung di direktori berikut:

- [Frontend Documentation (`/frontend/README.md`)](./frontend/README.md)
- [Backend Documentation (`/backend/README.md`)](./backend/README.md)
- [Machine Learning Documentation (`/docs/Dokumentasi ML.pdf`)](./docs/Dokumentasi%20ML.pdf)
- [Frontend Documentation PDF (`/docs/Dokumentasi FE.pdf`)](./docs/Dokumentasi%20FE.pdf)

---

## 💻 Menjalankan Aplikasi Secara Lokal

### 1. Menyiapkan Backend
```bash
# Buka direktori root project
# Buat dan aktivasi virtual environment (opsional tapi disarankan)
python -m venv .venv
.venv\Scripts\activate # Windows
# source .venv/bin/activate # Mac/Linux

# Install dependensi
pip install -r backend/requirements.txt

# Menjalankan server backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API akan aktif di `http://localhost:8000`.*
*(Pastikan mengatur `DATABASE_URL` di file `.env` backend untuk koneksi Neon/Railway PostgreSQL).*

### 2. Menyiapkan ML Service (Opsional / Terpisah)
```bash
cd ml
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```
*Service ML akan aktif di `http://localhost:8001`.*

### 3. Menyiapkan Frontend
Buka tab terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi web dapat diakses di `http://localhost:5173`.*
*(Pastikan endpoint API frontend diatur di `src/api/apiClient.js`).*

---

## 👥 Tim Pengembang (A25-CS065)

Aplikasi ini adalah hasil kerja keras *Capstone Project* dari tim **A25-CS065** (Dicoding Asah):

| Nama | ID Peserta | Peran Utama |
|---|---|---|
| **Akbar Rezy Hanara S** | R284D5Y0128 | **React & Backend with AI** |
| **Ahmad Misbach** | R284D5Y0099 | **React & Backend with AI** |
| **Bram Prastyo Nugroho** | R284D5Y0364 | **React & Backend with AI** |
| **Augie Bryan Athalla** | M296D5Y0308 | **Machine Learning** |
| **Fayzul Haq** | M284D5Y0624 | **Machine Learning** |

<div align="center">
  <br/>
  <b>Dikembangkan oleh Tim A25-CS065 - Dicoding Asah Capstone</b>
</div>
