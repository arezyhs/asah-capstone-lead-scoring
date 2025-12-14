
# Frontend (SalesPilot)

## Overview
SalesPilot Frontend adalah aplikasi web berbasis React yang berfungsi sebagai antarmuka utama untuk pengguna dalam mengelola, memantau, dan menganalisis data lead scoring. Aplikasi ini menampilkan dashboard, tabel data leads, detail customer, serta fitur login dan manajemen profil.

## Fitur Utama
- Dashboard analitik distribusi leads (pekerjaan, usia, pendidikan, status pernikahan)
- Tabel data leads dengan filter dan pencarian
- Halaman detail customer (profil, riwayat kampanye, catatan sales, call log)
- Login dan manajemen profil user
- Sidebar navigasi dan topbar
- Visualisasi data dengan Recharts

## Tech Stack
- React (Vite)
- TailwindCSS
- React Router
- Recharts
- Context API (Theme)
- Axios (API client)

## Struktur Folder
- `src/` - kode utama aplikasi
  - `api/` - API client dan service
  - `components/` - komponen UI
  - `context/` - context global (theme)
  - `layouts/` - layout utama
  - `pages/` - halaman aplikasi

## Setup & Instalasi
1. Masuk ke folder frontend:
  ```bash
  cd frontend
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Jalankan aplikasi:
  ```bash
  npm run dev
  ```
4. Akses aplikasi di `http://localhost:5173`

## Konfigurasi
- Konfigurasi endpoint API dapat diatur di file `src/api/apiClient.js`
- Styling menggunakan TailwindCSS, konfigurasi di `tailwind.config.js`

## Dokumentasi API
Lihat file `../docs/API.md` untuk daftar endpoint backend yang digunakan frontend.

## Catatan Pengembangan
- Pastikan backend sudah berjalan sebelum menjalankan frontend
- Untuk pengujian, gunakan kredensial uji yang tersedia di README root

---
