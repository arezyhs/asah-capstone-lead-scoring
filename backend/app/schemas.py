from typing import Dict, Any, List
from pydantic import BaseModel


class PredictRequest(BaseModel):
    features: Dict[str, Any]


class PredictResponse(BaseModel):
    probability: float
    score: int
    model_version: str


class HealthResponse(BaseModel):
    status: str
    uptime: int


class MetadataResponse(BaseModel):
    model_version: str
    features: List[str] = []
