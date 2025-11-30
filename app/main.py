import time
from typing import List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import komponen database kita
from .database import engine, get_db
from . import models, schemas
from .inference import ModelService
from .config import settings

# --- AUTO CREATE TABLES ---
# Baris ini akan otomatis membuat tabel di database jika belum ada
# (Cara cepat tanpa ribet migrasi manual untuk tahap awal)
# models.Base.metadata.create_all(bind=engine)  # Comment out for now

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model_service = ModelService()  # Comment out for now to avoid model loading issues
model_service = None  # Will initialize later
_start_time = time.time()

# --- Endpoints ---

@app.get("/")
def root():
    return {"message": "Lead Scoring API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "uptime": int(time.time() - _start_time)}

@app.post("/api/auth/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest):
    if payload.username == "sales_user_01" and payload.password == "password123":
        return {
            "token": "dummy-jwt-token",
            "user": {"name": "Sales User", "username": payload.username}
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# GET All Leads (Dari Database)
@app.get("/leads", response_model=List[schemas.LeadListResponse])
def get_leads(q: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Lead)
    if q:
        # Pencarian case-insensitive pada nama
        query = query.filter(models.Lead.customer_name.ilike(f"%{q}%"))
    return query.all()

# GET Lead Detail (Dari Database)
@app.get("/leads/{lead_id}", response_model=schemas.LeadDetailResponse)
def get_lead_detail(lead_id: str, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

# GET Notes
@app.get("/notes", response_model=List[schemas.NoteResponse])
def get_notes(leadId: str, db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.lead_id == leadId).all()

# POST Create Note
@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    # Pastikan lead-nya ada dulu
    lead = db.query(models.Lead).filter(models.Lead.id == note.leadId).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead ID not found")
        
    new_note = models.Note(lead_id=note.leadId, note=note.note)
    db.add(new_note)
    db.commit()
    db.refresh(new_note) # Ambil ID yang baru digenerate
    
    # Format return agar sesuai schema
    return {
        "id": new_note.id,
        "leadId": new_note.lead_id,
        "note": new_note.note,
        "timestamp": new_note.timestamp.isoformat()
    }

# Predict Endpoint (Tetap sama)
@app.post("/predict", response_model=schemas.PredictResponse)
def predict_lead_score(payload: schemas.PredictRequest):
    try:
        probability = model_service.predict(payload.features)
        score = int(round(probability * 100))
        return {
            "probability": probability,
            "score": score,
            "model_version": model_service.model_version
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    
@app.get("/metadata", response_model=schemas.MetadataResponse)
def get_model_metadata():
    return {
        "model_version": model_service.model_version,
        "features": model_service.expected_features
    }