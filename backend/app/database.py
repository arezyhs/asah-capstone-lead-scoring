"""
Data access layer for Lead Scoring API

This module provides data access functions and utilities for lead management.
In a production environment, this would interface with a real database.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime


class LeadData:
    """Lead data model."""
    def __init__(
        self,
        id: int,
        name: str,
        probability: float,
        score: int,
        job: Optional[str] = None,
        loan_status: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.name = name
        self.probability = probability
        self.score = score
        self.job = job
        self.loan_status = loan_status
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert lead data to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "probability": self.probability,
            "score": self.score,
            "job": self.job,
            "loan_status": self.loan_status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class LeadRepository:
    """Repository for lead data operations."""
    
    def __init__(self):
        """Initialize with dummy data."""
        self._leads: Dict[int, LeadData] = {
            1: LeadData(
                id=1,
                name="John Doe",
                probability=0.85,
                score=85,
                job="admin",
                loan_status="approved"
            ),
            2: LeadData(
                id=2,
                name="Jane Smith",
                probability=0.65,
                score=65,
                job="technician",
                loan_status="pending"
            ),
            3: LeadData(
                id=3,
                name="Alice Brown",
                probability=0.45,
                score=45,
                job="student",
                loan_status="rejected"
            )
        }
        self._next_id = 4
    
    def get_all_leads(
        self,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve all leads with optional filtering and sorting.
        
        Args:
            sort_by: Field to sort by
            sort_order: Sort order ('asc' or 'desc')
            search_query: Search query for filtering
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            List of lead dictionaries
        """
        leads = list(self._leads.values())
        
        # Apply search filter
        if search_query:
            query_lower = search_query.lower()
            leads = [
                lead for lead in leads
                if (query_lower in lead.name.lower() or 
                    (lead.job and query_lower in lead.job.lower()) or
                    (lead.loan_status and query_lower in lead.loan_status.lower()))
            ]
        
        # Apply sorting
        if sort_by:
            reverse = sort_order == "desc"
            
            if sort_by == "probability_score":
                leads.sort(key=lambda x: x.probability, reverse=reverse)
            elif sort_by == "name":
                leads.sort(key=lambda x: x.name, reverse=reverse)
            elif sort_by == "job":
                leads.sort(key=lambda x: x.job or "", reverse=reverse)
            elif sort_by == "loan_status":
                leads.sort(key=lambda x: x.loan_status or "", reverse=reverse)
        
        # Apply pagination
        if offset:
            leads = leads[offset:]
        if limit:
            leads = leads[:limit]
        
        return [lead.to_dict() for lead in leads]
    
    def get_lead_by_id(self, lead_id: int) -> Optional[Dict[str, Any]]:
        """
        Retrieve a specific lead by ID.
        
        Args:
            lead_id: Lead unique identifier
            
        Returns:
            Lead dictionary if found, None otherwise
        """
        lead = self._leads.get(lead_id)
        return lead.to_dict() if lead else None
    
    def create_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new lead.
        
        Args:
            lead_data: Lead information dictionary
            
        Returns:
            Created lead dictionary
        """
        lead = LeadData(
            id=self._next_id,
            name=lead_data["name"],
            probability=lead_data["probability"],
            score=lead_data["score"],
            job=lead_data.get("job"),
            loan_status=lead_data.get("loan_status")
        )
        
        self._leads[self._next_id] = lead
        self._next_id += 1
        
        return lead.to_dict()
    
    def update_lead(self, lead_id: int, lead_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update an existing lead.
        
        Args:
            lead_id: Lead unique identifier
            lead_data: Updated lead information
            
        Returns:
            Updated lead dictionary if found, None otherwise
        """
        lead = self._leads.get(lead_id)
        if not lead:
            return None
        
        # Update fields
        for field in ["name", "probability", "score", "job", "loan_status"]:
            if field in lead_data:
                setattr(lead, field, lead_data[field])
        
        lead.updated_at = datetime.utcnow()
        return lead.to_dict()
    
    def delete_lead(self, lead_id: int) -> bool:
        """
        Delete a lead.
        
        Args:
            lead_id: Lead unique identifier
            
        Returns:
            True if deleted, False if not found
        """
        if lead_id in self._leads:
            del self._leads[lead_id]
            return True
        return False


# Global repository instance
lead_repository = LeadRepository()