"""
Pydantic schemas for Lead Scoring API

This module defines all request/response models used in the API endpoints.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


# ML Prediction schemas
class PredictRequest(BaseModel):
    """Request schema for ML prediction endpoint."""
    features: Dict[str, Any] = Field(
        ..., 
        description="Feature dictionary for ML model prediction"
    )


class PredictResponse(BaseModel):
    """Response schema for ML prediction endpoint."""
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
    """Response schema for lead information."""
    id: int = Field(..., description="Lead unique identifier")
    name: str = Field(..., description="Lead customer name")
    probability: float = Field(
        ..., 
        description="Lead conversion probability (0.0-1.0)",
        ge=0.0,
        le=1.0
    )
    score: int = Field(
        ..., 
        description="Lead score (0-100)",
        ge=0,
        le=100
    )
    job: Optional[str] = Field(None, description="Customer job/occupation")
    loan_status: Optional[str] = Field(None, description="Current loan status")
