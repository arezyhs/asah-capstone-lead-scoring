"""
Pydantic schemas for Lead Scoring API

This module defines all request/response models used in the API endpoints.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


# ML Prediction schemas  
class PredictRequest(BaseModel):
    """Request schema for ML prediction endpoint based on bank marketing dataset."""
    customer_name: str = Field(..., min_length=1, max_length=100, description="Customer name")
    age: int = Field(..., ge=18, le=100, description="Customer age")
    job: str = Field(..., description="Job type (management, technician, entrepreneur, blue-collar, etc.)")
    marital: str = Field(..., description="Marital status (married, divorced, single)")
    education: str = Field(..., description="Education level (university.degree, high.school, basic.9y, etc.)")
    default: str = Field(default="no", description="Has credit in default? (yes/no)")
    housing: str = Field(..., description="Has housing loan? (yes/no)")
    loan: str = Field(..., description="Has personal loan? (yes/no)")
    contact: str = Field(default="cellular", description="Contact communication type (cellular/telephone)")
    month: str = Field(..., description="Last contact month (jan, feb, mar, etc.)")
    day_of_week: str = Field(..., description="Last contact day (mon, tue, wed, etc.)")
    campaign: int = Field(..., ge=1, description="Number of contacts during this campaign")
    pdays: int = Field(default=999, ge=-1, description="Days since last contact (-1 = never contacted)")
    previous: int = Field(default=0, ge=0, description="Number of contacts before this campaign")
    poutcome: str = Field(default="nonexistent", description="Previous campaign outcome (success/failure/nonexistent)")
    emp_var_rate: float = Field(default=-1.8, description="Employment variation rate")
    cons_price_idx: float = Field(default=92.893, description="Consumer price index")
    cons_conf_idx: float = Field(default=-46.2, description="Consumer confidence index")
    euribor3m: float = Field(default=1.313, description="Euribor 3 month rate")
    nr_employed: float = Field(default=5099.1, description="Number of employees")


class PredictResponse(BaseModel):
    """Response schema for ML prediction endpoint."""
    customer_name: str = Field(..., description="Customer name")
    probability: float = Field(
        ..., 
        description="Predicted probability (0.0-1.0)",
        ge=0.0,
        le=1.0
    )
    score: int = Field(
        ..., 
        description="Lead score (0-100)",
        ge=0,
        le=100
    )
    prediction: str = Field(
        ...,
        description="Binary prediction (yes/no)"
    )
    risk_category: str = Field(
        ...,
        description="Risk category (Low/Medium/High)"
    )
    model_version: str = Field(
        ..., 
        description="Version of the ML model used"
    )


# System health schemas
class HealthResponse(BaseModel):
    """Response schema for health check endpoint."""
    status: str = Field(..., description="API status")
    uptime: int = Field(..., description="Uptime in seconds")


class MetadataResponse(BaseModel):
    """Response schema for model metadata endpoint."""
    model_version: str = Field(..., description="ML model version")
    features: List[str] = Field(
        default_factory=list, 
        description="Expected feature names"
    )


# Authentication schemas
class LoginRequest(BaseModel):
    """Request schema for user authentication."""
    username: str = Field(..., description="User username")
    password: str = Field(..., description="User password")


class LoginResponse(BaseModel):
    """Response schema for successful authentication."""
    token: str = Field(..., description="JWT authentication token")
    user: Dict[str, Any] = Field(..., description="User information")


# Lead management schemas
class LeadResponse(BaseModel):
    """Response schema for lead information with real bank marketing data."""
    id: int = Field(..., description="Lead unique identifier")
    name: str = Field(..., description="Customer name or ID")
    profile: Optional[str] = Field(None, description="Customer profile description")
    age: int = Field(..., description="Customer age")
    job: str = Field(..., description="Job type")
    marital: str = Field(..., description="Marital status")
    education: str = Field(..., description="Education level")
    default: str = Field(..., description="Credit in default")
    balance: Optional[int] = Field(None, description="Account balance")
    housing: str = Field(..., description="Housing loan")
    loan: str = Field(..., description="Personal loan")
    contact: str = Field(..., description="Contact type")
    month: str = Field(..., description="Last contact month")
    day_of_week: Optional[str] = Field(None, description="Last contact day of week")
    campaign: int = Field(..., description="Campaign contacts")
    pdays: int = Field(..., description="Days since previous contact")
    previous: int = Field(..., description="Previous campaign contacts")
    poutcome: str = Field(..., description="Previous outcome")
    emp_var_rate: float = Field(..., description="Employment variation rate")
    cons_price_idx: float = Field(..., description="Consumer price index")
    cons_conf_idx: float = Field(..., description="Consumer confidence index")
    euribor3m: float = Field(..., description="Euribor 3 month rate")
    nr_employed: float = Field(..., description="Number of employees")
    probability: Optional[float] = Field(
        None, 
        description="ML predicted probability (0.0-1.0)",
        ge=0.0,
        le=1.0
    )
    score: Optional[float] = Field(
        None, 
        description="Lead score (0.0-1.0)",
        ge=0.0,
        le=1.0
    )
    prediction: Optional[str] = Field(None, description="ML prediction (yes/no)")
    actual_outcome: Optional[str] = Field(None, description="Historical outcome from dataset")
    status: Optional[str] = Field(None, description="Lead status")
    created_at: Optional[str] = Field(None, description="Creation timestamp")
    updated_at: Optional[str] = Field(None, description="Update timestamp")
