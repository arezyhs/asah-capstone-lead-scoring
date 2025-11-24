
"""
Lead Scoring Inference API

A FastAPI application providing ML-based lead scoring with authentication
and comprehensive lead management endpoints.
"""

import time
from typing import List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    PredictRequest, 
    PredictResponse, 
    HealthResponse, 
    MetadataResponse, 
    LoginRequest, 
    LoginResponse, 
    LeadResponse
)
from .inference import ModelService
from .config import settings
from .database import lead_repository

# Initialize FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="ML-powered lead scoring system with authentication and lead management",
    debug=settings.debug
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=settings.cors_methods,
    allow_headers=settings.cors_headers,
)

# Initialize services
model_service = ModelService()
_start_time = time.time()

# Simple authentication (for production, use proper JWT and password hashing)
DUMMY_USER = {
    "username": "sales_user_01",
    "password": "password123",
    "name": "Sales User"
}

def authenticate_user(username: str, password: str):
    """Simple authentication function."""
    if username == DUMMY_USER["username"] and password == DUMMY_USER["password"]:
        return DUMMY_USER
    return None



# Health check endpoint
@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint to verify API status and uptime."""
    return HealthResponse(
        status="ok", 
        uptime=int(time.time() - _start_time)
    )

# Authentication endpoints
@app.post("/api/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    """Authenticate user with username and password."""
    user = authenticate_user(payload.username, payload.password)
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Invalid username or password"
        )
    
    return LoginResponse(
        token="a1b2c3d4-dummy-jwt-token-string-e5f6-secure",  # TODO: Use proper JWT
        user={
            "name": user["name"],
            "username": user["username"]
        }
    )

# Lead management endpoints
@app.get("/leads", response_model=List[LeadResponse])
def get_leads(
    _sort: str = Query(None, description="Sort field"),
    _order: str = Query(None, description="Sort order (asc/desc)"), 
    q: str = Query(None, description="Search query"),
    _limit: int = Query(100, description="Maximum number of results"),
    _offset: int = Query(0, description="Number of results to skip")
):
    """Retrieve list of leads with optional sorting and filtering."""
    leads = lead_repository.get_all_leads(
        sort_by=_sort,
        sort_order=_order,
        search_query=q,
        limit=_limit,
        offset=_offset
    )
    return leads

@app.get("/leads/{lead_id}", response_model=LeadResponse)
def get_lead_detail(lead_id: int):
    """Retrieve detailed information for a specific lead."""
    lead = lead_repository.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return lead

@app.get("/notes")
def get_notes(leadId: int = Query(None, description="Lead ID to filter notes")):
    """Retrieve notes associated with a specific lead."""
    # TODO: Implement actual notes retrieval
    return []

# ML prediction endpoints
@app.post("/predict", response_model=PredictResponse)
def predict_lead_score(payload: PredictRequest):
    """Generate lead score prediction using ML model."""
    try:
        probability = model_service.predict(payload.features)
        score = int(round(probability * 100))
        return PredictResponse(
            probability=probability,
            score=score,
            model_version=model_service.model_version
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.get("/metadata", response_model=MetadataResponse)
def get_model_metadata():
    """Retrieve model metadata including version and expected features."""
    return MetadataResponse(
        model_version=model_service.model_version,
        features=list(model_service.expected_features)
    )
