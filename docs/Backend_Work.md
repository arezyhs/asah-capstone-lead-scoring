# Backend — Ringkasan Pengerjaan untuk Tim

Dokumen ini merangkum pekerjaan yang telah dilakukan pada bagian Backend (PoC) supaya seluruh anggota tim dapat memahami status, cara menjalankan, dan langkah berikutnya.

## Ringkasan singkat
- Framework: FastAPI (Python) + Uvicorn
- Lokasi kode backend: `backend/`
- Status saat ini: scaffold backend lengkap dengan endpoint dasar, inference stub, test otomatis, Dockerfile, dan dokumentasi run singkat. Tests lulus secara lokal.

## Apa yang telah dibuat (file penting)
- `backend/requirements.txt` — daftar dependensi untuk backend
- `backend/app/main.py` — aplikasi FastAPI dengan endpoint: `/health`, `/predict`, `/metadata`
- `backend/app/inference.py` — `ModelService` yang memuat model jika ada (`backend/model.joblib`) atau fallback dummy predict
- `backend/app/schemas.py` — Pydantic schemas untuk request/response
- `backend/tests/test_api.py` — test unit/integration untuk endpoint dasar
- `backend/Dockerfile` — image build untuk service
- `backend/README.md` — petunjuk run singkat (PowerShell)
- `backend/docs/WORK_DONE.md` — (detail teknis, lokasi: `backend/docs/`) — catatan lengkap penerapan

## End-to-end: cara menjalankan (PowerShell)
1. Masuk ke folder backend:

```powershell
cd .\backend
```

2. Buat dan aktifkan virtual environment (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependensi dan jalankan server:

```powershell
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```

4. Jalankan tests (di shell dengan venv aktif):

```powershell
python -m pytest -q
```

Catatan: selama pengecekan lokal, tests yang lulus: `3 passed`.

## Endpoint ringkasan
- GET `/health` — Cek service health
- POST `/predict` — Body: `{ "features": { ... } }` -> Response: `{ probability, score, model_version }`
- GET `/metadata` — Response: `{ model_version, features }`

## Hasil test lokal
- Semua test unit/integration yang ada pada `backend/tests` lulus (3 passed).

## Rekomendasi langkah berikutnya (prioritas)
1. Integrasikan preprocessing dari `ml/` notebook ke `backend/app/inference.py` (penting untuk konsistensi ML).
2. Simpan artefak model nyata: `backend/model.joblib` (atau format lain yang disepakati) dan pastikan `ModelService` dapat memuatnya.
3. Tambahkan logging terstruktur dan metrics (request_count, error_count, latency).
4. Buat endpoint `POST /feedback` dan simpan feedback ke DB (SQLite untuk PoC).
5. Tambahkan GitHub Actions untuk CI (tests + lint + optional Docker build).

## Kontak & tanggung jawab
- Back End: (Anda) — implementasi inference pipeline, logging, DB feedback, CI
- ML: (anggota ML) — menyediakan preprocessing detail dan artefak model
- Front End: (anggota FE) — integrasi kontrak API