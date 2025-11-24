
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
from .inference import model_service
from .data_service import bank_data_service
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

# Initialize services (model_service imported from inference.py)
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
    _limit: int = Query(50, description="Maximum number of results"),
    _offset: int = Query(0, description="Number of results to skip")
):
    """Retrieve list of leads with real bank marketing data and ML predictions."""
    try:
        # Get sample leads from real bank dataset
        sample_leads = bank_data_service.get_sample_leads(_limit)
        
        # Apply ML predictions to each lead
        for lead in sample_leads:
            try:
                # Prepare features for prediction
                features = bank_data_service.prepare_features_for_prediction(lead)
                prediction_result = model_service.predict(features)
                
                # Update lead with real ML prediction
                lead["probability"] = prediction_result["probability"]
                lead["score"] = prediction_result["probability"]
                lead["prediction"] = prediction_result["prediction"]
            except Exception as e:
                # Keep dummy values if prediction fails
                pass
        
        # Apply search filter if provided
        if q:
            q_lower = q.lower()
            sample_leads = [
                lead for lead in sample_leads
                if q_lower in lead["name"].lower() or 
                   q_lower in lead["job"].lower() or
                   q_lower in lead["education"].lower()
            ]
        
        # Apply sorting if provided
        if _sort and hasattr(sample_leads[0] if sample_leads else {}, 'get'):
            reverse = _order == "desc"
            sample_leads.sort(key=lambda x: x.get(_sort, 0), reverse=reverse)
        
        # Apply pagination
        start = _offset
        end = _offset + _limit
        paginated_leads = sample_leads[start:end]
        
        return paginated_leads
        
    except Exception as e:
        # Fallback to repository data if bank data service fails
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
    """Generate lead score prediction using XGBoost model trained on bank marketing dataset."""
    try:
        # Convert Pydantic model to dict for prediction
        features = payload.dict()
        customer_name = features.pop('customer_name')
        
        # Get prediction from model service
        prediction_result = model_service.predict(features)
        
        return PredictResponse(
            customer_name=customer_name,
            probability=prediction_result["probability"],
            score=prediction_result["score"],
            prediction=prediction_result["prediction"],
            risk_category=prediction_result["risk_category"],
            model_version=prediction_result["model_version"]
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")

@app.get("/metadata", response_model=MetadataResponse)
def get_model_metadata():
    """Retrieve model metadata including version and expected features."""
    model_info = model_service.get_model_info()
    return MetadataResponse(
        model_version=model_info["version"],
        features=model_info["expected_features"]
    )

@app.get("/model/info")
def get_detailed_model_info():
    """Get comprehensive model information including feature importance."""
    model_info = model_service.get_model_info()
    feature_importance = model_service.get_feature_importance()
    dataset_info = bank_data_service.get_dataset_info()
    
    return {
        "model": model_info,
        "feature_importance": feature_importance,
        "dataset": dataset_info
    }
