import time
from typing import List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from .database import engine, get_db
from . import models, schemas
from .config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/leads", response_model=List[schemas.LeadListResponse])
def get_leads(q: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Lead)
    if q:
        query = query.filter(models.Lead.customer_name.ilike(f"%{q}%"))
    return query.all()

@app.get("/leads/{lead_id}", response_model=schemas.LeadDetailResponse)
def get_lead_detail(lead_id: str, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@app.get("/notes", response_model=List[schemas.NoteResponse])
def get_notes(leadId: str, db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.lead_id == leadId).all()

@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == note.leadId).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead ID not found")
    new_note = models.Note(lead_id=note.leadId, note=note.note)
    db.add(new_note)
    db.commit()
    db.refresh(new_note) 
    return {
        "id": new_note.id,
        "leadId": new_note.lead_id,
        "note": new_note.note,
        "timestamp": new_note.timestamp.isoformat()
    }

# Endpoint untuk mencatat panggilan (Call Log)
@app.post("/calls")
def record_call(payload: schemas.CallLogRequest, db: Session = Depends(get_db)):
    new_log = models.CallLog(
        lead_id=payload.leadId,
        username="sales_user_01"  
    )
    db.add(new_log)
    db.commit()
    return {"status": "success", "message": "Call recorded"}
    
@app.get("/api/profile")
def get_user_profile(db: Session = Depends(get_db)):
    # 1. Hitung Statistik Dasar
    leads = db.query(models.Lead).all()
    total_leads = len(leads)
    high_potential = sum(1 for lead in leads if lead.score > 70)
    
    # Hitung total Direct Calls (Real-time) untuk sales ini
    total_calls_realtime = db.query(models.CallLog).filter(
        models.CallLog.username == "sales_user_01"
    ).count()

    conversion_rate = 0
    if total_leads > 0:
        conversion_rate = round((high_potential / total_leads) * 100, 1)

    # 2. AMBIL SALES NOTES (SEMUA)
    raw_notes = db.query(models.Note, models.Lead.customer_name)\
        .join(models.Lead, models.Note.lead_id == models.Lead.id)\
        .order_by(desc(models.Note.timestamp))\
        .all()
    
    notes_list = []
    for note, customer_name in raw_notes:
        notes_list.append({
            "id": note.id,
            "customer_name": customer_name,
            "note": note.note,
            "timestamp": note.timestamp,
            "lead_id": note.lead_id
        })

    # 3. AMBIL DIRECT CALL HISTORY (REAL DATA DARI DB)
    raw_calls = db.query(models.CallLog, models.Lead.customer_name)\
        .join(models.Lead, models.CallLog.lead_id == models.Lead.id)\
        .filter(models.CallLog.username == "sales_user_01")\
        .order_by(desc(models.CallLog.timestamp))\
        .all()

    calls_list = []
    for call, customer_name in raw_calls:
        calls_list.append({
            "id": call.id,
            "customer_name": customer_name,
            # UPDATE PENTING: Tambahkan lead_id agar Frontend bisa generate link
            "lead_id": call.lead_id, 
            "status": "Connected", 
            "duration": "Recorded", 
            "timestamp": call.timestamp
        })

    return {
        "user": {
            "name": "Sales User",
            "username": "sales_user_01",
            "role": "Senior Sales Representative",
            "employee_id": "SLS-2025-088",
            "join_date": "15 Januari 2025",
            "email": "sales01@bank-asah.co.id",
            "phone": "+62 812-3456-7890",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=SalesUser"
        },
        "performance": {
            "total_leads_processed": total_leads,
            "high_potential_found": high_potential,
            "conversion_rate": f"{conversion_rate}%",
            "monthly_target": 150,
            "total_direct_calls": total_calls_realtime 
        },
        "recent_notes": notes_list,
        "recent_calls": calls_list, 
        
        "upcoming_features": [
            {
                "title": "Commission Simulator",
                "description": "Hitung estimasi bonus komisi Anda secara real-time berdasarkan closing deals.",
                "release_date": "Q3 2025"
            },
            {
                "title": "Smart Route Planner",
                "description": "Optimalkan rute kunjungan lapangan harian Anda dengan AI Maps.",
                "release_date": "Q4 2025"
            }
        ]
    }