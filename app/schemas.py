from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# --- Common/Shared Schemas ---
class NoteBase(BaseModel):
    leadId: str
    note: str
    timestamp: Optional[str] = None

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    
class Config:
    from_attributes = True

# --- ML & System Schemas ---
class PredictRequest(BaseModel):
    features: Dict[str, Any]

class PredictResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    probability: float
    score: int
    model_version: str

class HealthResponse(BaseModel):
    status: str
    uptime: int

class MetadataResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    model_version: str
    features: List[str]

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

# --- Detailed Lead Schemas (Sesuai Struktur Database & Frontend) ---
class KeyInformation(BaseModel):
    customer_id: str
    customer_name: str
    probability_score: int
    status_target: str

class DemographicProfile(BaseModel):
    age: int
    job: str
    marital_status: str
    education: str

class FinancialProfile(BaseModel):
    defaulted_credit: str
    average_balance: int
    housing_loan: str
    personal_loan: str

class CampaignHistory(BaseModel):
    last_contact_date: str
    contact_type: str
    duration_seconds: int
    previous_outcome: str
    campaign_contacts: int
    previous_contacts: int
    days_since_previous: int

# Pastikan LeadListResponse menggunakan String ID dan customer_name
class LeadListResponse(BaseModel):
    id: str  
    customer_name: str 
    probability_score: float
    score: int
    job: Optional[str] = None
    loan_status: Optional[str] = None
    
    class Config:
        from_attributes = True

# Pastikan LeadDetailResponse punya kolom nested (JSON)
class LeadDetailResponse(BaseModel):
    id: str
    customer_name: str
    probability_score: float
    score: int
    job: Optional[str] = None
    loan_status: Optional[str] = None
    
    # Kolom JSON Wajib Ada agar halaman Detail tidak error
    key_information: Optional[Any] = None
    demographic_profile: Optional[Any] = None
    financial_profile: Optional[Any] = None
    campaign_history: Optional[Any] = None

    class Config:
        from_attributes = True