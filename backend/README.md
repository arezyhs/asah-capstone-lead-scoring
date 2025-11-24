# Lead Scoring Backend API

Professional FastAPI backend for ML-powered lead scoring system.

## Features

- **ML Model Inference**: Real-time lead scoring predictions
- **Authentication**: JWT-based user authentication
- **Lead Management**: CRUD operations for leads
- **Health Monitoring**: API health checks and monitoring
- **Professional Structure**: Clean architecture with separation of concerns

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application and routes
│   ├── config.py            # Configuration settings
│   ├── schemas.py           # Pydantic models and schemas
│   ├── inference.py         # ML model service
│   ├── auth.py              # Authentication utilities
│   └── database.py          # Data access layer
├── models/                  # ML model artifacts
│   ├── model_final_xgb.pkl
│   ├── scaler.pkl
│   └── model_columns.pkl
└── requirements.txt         # Python dependencies
│   ├── __init__.py
│   ├── main.py
│   ├── inference.py
│   ├── schemas.py
│
├── models
│   ├── model.joblib
│   ├── scaler.pkl
│   ├── model_columns.pkl
│
├── tests
│   ├── test_api.py
│
├── docs
│   ├── API.md
│   ├── sample_payloads.json
│   ├── WORK_DONE.md
```

## Quick Start
1. Buat & aktifkan virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Jalankan server:
   ```powershell
   uvicorn app.main:app --reload --port 8080
   ```

## API Endpoints
- GET `/health` — service health
- POST `/predict` — request body: `{ "features": { ... } }`, response: `{ probability, score, model_version }`
- GET `/metadata` — returns `model_version` and expected features

## Catatan
- Artefak model untuk inference diletakkan di `/models`
- Dokumentasi API dan contoh payload di `/docs`
- Semua source code FastAPI di `/app`
- Tes di `/tests`