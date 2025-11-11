# Backend — Catatan Pengerjaan Detil

Dokumen ini berisi catatan teknis dan langkah yang sudah dikerjakan untuk modul backend. Ditujukan untuk pengembang yang akan melanjutkan pekerjaan ini.

## Tujuan
Menyiapkan backend PoC yang dapat menerima feature payload, menjalankan preprocessing (stub untuk sekarang), dan mengembalikan probabilitas + skor prioritas. Service harus mudah dijalankan secara lokal, mudah diuji, dan mudah diganti modelnya.

## Ringkasan perubahan yang telah dibuat
- Scaffold FastAPI dengan endpoints: `/health`, `/predict`, `/metadata` (`backend/app/main.py`).
- `ModelService` di `backend/app/inference.py`:
  - Mencari `backend/model.joblib` saat inisialisasi.
  - Jika model tidak ditemukan, memakai dummy predict deterministik.
  - Fungsi `preprocess(features)` ada sebagai placeholder — harus disesuaikan dengan pipeline training.
- Pydantic schemas di `backend/app/schemas.py` untuk validasi input/response.
- Test suite dasar di `backend/tests/test_api.py` menggunakan FastAPI TestClient.
- `Dockerfile` untuk build image PoC.
- `requirements.txt` dengan dependensi yang dibutuhkan.

## Cara kerja inference sekarang
- Jika `backend/model.joblib` ada, `ModelService` akan mencoba memuatnya dan menggunakan `predict_proba` untuk menghasilkan probabilitas.
- Jika tidak ada artefak model, service menggunakan rule-of-thumb dummy: rata-rata nilai numerik dari fitur digunakan untuk menghasilkan probabilitas (deterministik) — ini hanya untuk PoC dan testing.

## Hasil tes
- Pada environment development (Windows PowerShell), setelah menginstall dependencies, test dijalankan dan hasil: `3 passed`.

## Tempat untuk menambahkan preprocessing nyata
- Buka `backend/app/inference.py` dan implementasikan method `preprocess(self, features)` sesuai pipeline di notebook `ml/EDA_Bank_Dataset_Additional_Full.ipynb`.
- Pastikan kolom yang dihasilkan cocok dengan input yang diharapkan model nyata (urutan/kolom jika model mengharapkan DataFrame).

## Menambahkan model artefak
1. Latih model dengan pipeline ML (di folder `ml/`).
2. Simpan model (joblib): `joblib.dump(model, "backend/model.joblib")`.
3. Restart server; `ModelService` akan memuat model baru saat inisialisasi.

## Checklist teknis untuk pengembang Backend
- [ ] Implement `preprocess` sesuai notebook ML
- [ ] Tambahkan handling untuk categorical unseen values (one-hot / mapping)
- [ ] Implement batch inference (optional)
- [ ] Tambahkan logging terstruktur (request id, latency, model_version)
- [ ] Tambahkan metrics (Prometheus exporter or log-based)
- [ ] Tambahkan endpoint `POST /feedback` untuk menyimpan label real-world
- [ ] Tambahkan DB (SQLite) dan migration script (alembic optional)
- [ ] Tambahkan GitHub Actions workflow untuk tests dan lint

## Contoh request/response
- Request `/predict` (JSON):

```
{ "features": { "age": 40, "balance": 1000.0, "job": "admin" } }
```

- Response (JSON):

```
{ "probability": 0.72, "score": 72, "model_version": "v0.0-dummy" }
```

## Lokasi file & penjelasan singkat
- `backend/app/main.py` — entrypoint dan routing
- `backend/app/inference.py` — model loader & prediction logic
- `backend/app/schemas.py` — Pydantic models
- `backend/tests/test_api.py` — tests
- `backend/Dockerfile` — docker image
- `backend/requirements.txt` — dependencies

---