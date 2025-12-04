from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# --- Common/Shared Schemas ---
class NoteBase(BaseModel):
    leadId: str
    note: str
    # Input dari Frontend dikirim sebagai string ISO
    timestamp: Optional[str] = None 

class NoteCreate(NoteBase):
    pass

# --- FIX: NoteResponse yang "Cerdas" ---
class NoteResponse(BaseModel):
    id: int
    
    # 1. Alias: "Kalau ketemu 'lead_id' (dari database), anggap itu 'leadId'"
    leadId: str = Field(validation_alias="lead_id") 
    
    note: str
    
    # 2. Datetime: Terima format datetime (dari DB) ATAU string (dari POST), nanti otomatis dirapikan
    timestamp: Optional[datetime] = None

    # 3. Config Sakti:
    # - from_attributes=True: Bisa baca data dari Database (ORM)
    # - populate_by_name=True: Bisa baca data dari Dictionary manual (POST)
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


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

# --- Detailed Lead Schemas ---
class KeyInformation(BaseModel):
    customer_id: str
    customer_name: str
    probability_score: int
    status_target: str

class DemographicProfile(BaseModel):
    age: int
    job: Optional[str] = None
    marital_status: Optional[str] = None
    education: Optional[str] = None

class FinancialProfile(BaseModel):
    defaulted_credit: Optional[str] = None
    average_balance: int
    housing_loan: Optional[str] = None
    personal_loan: Optional[str] = None

class CampaignHistory(BaseModel):
    last_contact_date: Optional[str] = None
    contact_type: Optional[str] = None
    duration_seconds: int
    previous_outcome: Optional[str] = None
    campaign_contacts: int
    previous_contacts: Optional[int] = 0
    days_since_previous: int

class LeadListResponse(BaseModel):
    id: str  
    customer_name: str 
    probability_score: float
    score: int
    job: Optional[str] = None
    loan_status: Optional[str] = None
    
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