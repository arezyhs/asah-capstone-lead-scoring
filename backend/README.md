# Backend — Lead Scoring Inference (PoC)

This backend is a minimal FastAPI-based inference service for the Lead Scoring PoC. It includes a small dummy inference implementation so the service runs without an actual model artifact. Replace the dummy logic with your real preprocessing and model loading.

Quick start (Windows PowerShell):

1. Create & activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Run locally with Uvicorn:

```powershell
uvicorn app.main:app --reload --port 8080
```

API endpoints:
- GET `/health` — service health
- POST `/predict` — request body: `{ "features": { ... } }`, response: `{ probability, score, model_version }`
- GET `/metadata` — returns `model_version` and expected features

Development notes:
- Place a serialized model at `backend/model.joblib` (optional). `app.inference.ModelService` will attempt to load it.
- Add real preprocessing logic to `app/inference.py` to match training pipeline.