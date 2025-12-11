from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# --- Common/Shared Schemas ---
class NoteBase(BaseModel):
    leadId: str
    note: str
    timestamp: Optional[str] = None 

class NoteCreate(NoteBase):
    pass

class NoteResponse(BaseModel):
    id: int
    leadId: str = Field(validation_alias="lead_id") 
    note: str
    timestamp: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class HealthResponse(BaseModel):
    status: str
    uptime: int

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]


class LeadListResponse(BaseModel):
    id: str  
    customer_name: str 
    probability_score: float
    score: int
    job: Optional[str] = None
    loan_status: Optional[str] = None
    
    financial_profile: Optional[Any] = None
    demographic_profile: Optional[Any] = None
    campaign_history: Optional[Any] = None
    
    model_config = ConfigDict(from_attributes=True)

class LeadDetailResponse(BaseModel):
    id: str
    customer_name: str
    probability_score: float
    score: int
    job: Optional[str] = None
    loan_status: Optional[str] = None
    
    key_information: Optional[Any] = None
    demographic_profile: Optional[Any] = None
    financial_profile: Optional[Any] = None
    campaign_history: Optional[Any] = None

    model_config = ConfigDict(from_attributes=True)
    
class CallLogRequest(BaseModel):
    leadId: str