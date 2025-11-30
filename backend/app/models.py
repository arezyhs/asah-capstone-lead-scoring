from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Lead(Base):
    __tablename__ = "leads"

    # Kolom Utama
    id = Column(String, primary_key=True, index=True)
    customer_name = Column(String, index=True)
    probability_score = Column(Float)
    score = Column(Integer)
    job = Column(String)
    loan_status = Column(String)
    
    # Kolom JSON untuk data kompleks
    key_information = Column(JSON)
    demographic_profile = Column(JSON)
    financial_profile = Column(JSON)
    campaign_history = Column(JSON)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lead_id = Column(String, ForeignKey("leads.id")) 
    note = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())