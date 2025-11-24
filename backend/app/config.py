"""
Configuration settings for Lead Scoring API

This module contains configuration classes and settings for different environments.
"""

import os
from typing import List, Optional
from pydantic import BaseModel


class Settings(BaseModel):
    """Application settings with environment variable support."""
    
    # API Configuration
    app_name: str = "Lead Scoring Inference API"
    app_version: str = "0.1.0"
    debug: bool = False
    
    # Server Configuration
    host: str = "127.0.0.1"
    port: int = 8000
    
    # CORS Configuration
    cors_origins: List[str] = ["*"]  # In production, specify exact origins
    cors_methods: List[str] = ["*"]
    cors_headers: List[str] = ["*"]
    
    # Model Configuration
    model_dir: Optional[str] = None
    model_name: str = "model_final_xgb.pkl"
    scaler_name: str = "scaler.pkl"
    model_columns_name: str = "model_columns.pkl"
    
    # Authentication Configuration
    secret_key: str = "dummy-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    



# Create global settings instance
settings = Settings()