"""
Real Data Service for Bank Marketing Dataset

This module provides services for loading and managing real bank marketing data,
including sample leads generation and data preprocessing for ML predictions.
"""

import os
import pandas as pd
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)


class BankDataService:
    """
    Service for managing bank marketing dataset.
    
    Provides functionality to load real bank data, generate sample leads,
    and prepare data for ML predictions.
    """
    
    def __init__(self, dataset_path: Optional[str] = None):
        """Initialize BankDataService with dataset path."""
        self.dataset_path = dataset_path or self._get_default_dataset_path()
        self.df: Optional[pd.DataFrame] = None
        self.processed_df: Optional[pd.DataFrame] = None
        self._load_dataset()
    
    def _get_default_dataset_path(self) -> str:
        """Get default path to bank dataset."""
        ml_dir = Path(__file__).parent.parent.parent / "ml" / "dataset"
        return str(ml_dir / "bank.csv")
    
    def _load_dataset(self) -> None:
        """Load and preprocess bank dataset from CSV file."""
        try:
            if os.path.exists(self.dataset_path):
                # Load raw dataset
                self.df = pd.read_csv(self.dataset_path, sep=';')
                logger.info(f"Loaded bank dataset with {len(self.df)} records")
                logger.info(f"Raw dataset columns: {list(self.df.columns)}")
                
                # Preprocess the dataset to match model expectations
                self.processed_df = self._preprocess_dataset(self.df)
                logger.info(f"Processed dataset ready for ML predictions")
            else:
                logger.warning(f"Dataset file not found: {self.dataset_path}")
                self.df = None
                self.processed_df = None
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            self.df = None
            self.processed_df = None
    
    def _preprocess_dataset(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Preprocess raw dataset to match model expectations.
        
        This method applies the same preprocessing steps as done in the EDA notebook.
        """
        try:
            processed = df.copy()
            
            # Add missing columns that might be needed for the model
            # Based on model_columns.pkl, we need these additional features:
            
            # Add day_of_week (since dataset only has 'day')
            if 'day_of_week' not in processed.columns:
                # Create a mapping from day number to day_of_week
                # For simplicity, we'll create a random day_of_week
                processed['day_of_week'] = processed.apply(
                    lambda x: random.choice(['mon', 'tue', 'wed', 'thu', 'fri']), axis=1
                )
            
            # Add economic indicators if not present (these seem to be from bank-full.csv)
            if 'emp.var.rate' not in processed.columns:
                processed['emp.var.rate'] = -1.8  # Default value
            if 'cons.price.idx' not in processed.columns:
                processed['cons.price.idx'] = 92.893
            if 'cons.conf.idx' not in processed.columns:
                processed['cons.conf.idx'] = -46.2
            if 'euribor3m' not in processed.columns:
                processed['euribor3m'] = 1.313
            if 'nr.employed' not in processed.columns:
                processed['nr.employed'] = 5099.1
            
            # Create 'pernah_dihubungi' feature (whether customer was previously contacted)
            processed['pernah_dihubungi'] = (processed['pdays'] != -1).astype(int)
            
            return processed
            
        except Exception as e:
            logger.error(f"Error preprocessing dataset: {e}")
            return df
    
    def get_sample_leads(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Generate sample leads from real bank dataset.
        
        Args:
            limit: Maximum number of sample leads to return
            
        Returns:
            List of lead dictionaries with REAL bank data (no dummy customer names)
        """
        if self.processed_df is None:
            return self._generate_dummy_leads(limit)
        
        try:
            # Sample random records from processed dataset
            sample_df = self.processed_df.sample(n=min(limit, len(self.processed_df)))
            leads = []
            
            for idx, row in sample_df.iterrows():
                # Use REAL customer identifiers based on their actual characteristics
                customer_id = f"CUST_{int(idx):06d}"
                customer_profile = self._create_customer_profile(row)
                
                lead = {
                    "id": int(idx),
                    "name": customer_id,  # Use customer ID instead of fake names
                    "profile": customer_profile,  # Add customer profile based on real data
                    "age": int(row['age']),
                    "job": row['job'],
                    "marital": row['marital'],
                    "education": row['education'],
                    "default": row['default'],
                    "balance": int(row.get('balance', 0)),
                    "housing": row['housing'],
                    "loan": row['loan'],
                    "contact": row['contact'],
                    "month": row['month'],
                    "day_of_week": row.get('day_of_week', 'mon'),
                    "campaign": int(row['campaign']),
                    "pdays": int(row['pdays']),
                    "previous": int(row['previous']),
                    "poutcome": row['poutcome'],
                    "emp_var_rate": float(row.get('emp.var.rate', -1.8)),
                    "cons_price_idx": float(row.get('cons.price.idx', 92.893)),
                    "cons_conf_idx": float(row.get('cons.conf.idx', -46.2)),
                    "euribor3m": float(row.get('euribor3m', 1.313)),
                    "nr_employed": float(row.get('nr.employed', 5099.1)),
                    "score": random.uniform(0.1, 0.9),  # Will be replaced by real prediction
                    "prediction": row.get('y', 'no'),  # Use actual target variable from dataset
                    "actual_outcome": row.get('y', 'no'),  # Actual historical outcome
                    "status": self._determine_status_from_data(row),
                    "created_at": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                leads.append(lead)
            
            return leads
            
        except Exception as e:
            logger.error(f"Error generating sample leads: {e}")
            return self._generate_dummy_leads(limit)
    
    def _create_customer_profile(self, row: pd.Series) -> str:
        """Create a customer profile description based on real data."""
        age = int(row['age'])
        job = row['job']
        marital = row['marital']
        education = row['education']
        
        # Create a meaningful profile based on actual customer characteristics
        profile_parts = []
        
        # Age group
        if age < 25:
            profile_parts.append("Young Professional")
        elif age < 35:
            profile_parts.append("Early Career")
        elif age < 50:
            profile_parts.append("Mid Career")
        elif age < 65:
            profile_parts.append("Senior Professional")
        else:
            profile_parts.append("Retirement Age")
        
        # Job category
        job_mapping = {
            'management': 'Manager',
            'technician': 'Technical',
            'entrepreneur': 'Business Owner',
            'blue-collar': 'Blue Collar',
            'unknown': 'Unknown Profession',
            'retired': 'Retired',
            'admin.': 'Administrative',
            'services': 'Service Industry',
            'self-employed': 'Self Employed',
            'unemployed': 'Unemployed',
            'housemaid': 'Domestic Worker',
            'student': 'Student'
        }
        
        profile_parts.append(job_mapping.get(job, job.title()))
        
        # Education level
        if education in ['tertiary', 'university.degree']:
            profile_parts.append('University Educated')
        elif education in ['secondary', 'high.school']:
            profile_parts.append('High School Educated')
        elif education in ['primary', 'basic.4y', 'basic.6y', 'basic.9y']:
            profile_parts.append('Basic Education')
        
        return " | ".join(profile_parts)
    
    def _determine_status_from_data(self, row: pd.Series) -> str:
        """Determine customer status based on historical data."""
        # Use actual campaign and outcome data to determine status
        campaign_count = int(row.get('campaign', 1))
        poutcome = row.get('poutcome', 'unknown')
        previous = int(row.get('previous', 0))
        actual_outcome = row.get('y', 'no')
        
        if actual_outcome == 'yes':
            return "Converted"
        elif poutcome == 'success' and previous > 0:
            return "Previously Converted"
        elif poutcome == 'failure' and previous > 0:
            return "Previously Contacted - Not Converted"
        elif campaign_count > 3:
            return "Heavily Contacted"
        elif campaign_count > 1:
            return "Multiple Contacts"
        else:
            return "New Lead"
    
    def _generate_customer_name(self) -> str:
        """Generate realistic customer name."""
        first_names = [
            "Ahmad", "Siti", "Budi", "Andi", "Maria", "John", "Sarah", "David", "Lisa", "Michael",
            "Anna", "Robert", "Emma", "James", "Olivia", "William", "Sophia", "Benjamin", "Isabella"
        ]
        last_names = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
            "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor"
        ]
        return f"{random.choice(first_names)} {random.choice(last_names)}"
    
    def _generate_dummy_leads(self, limit: int) -> List[Dict[str, Any]]:
        """Generate dummy leads when real dataset is not available."""
        leads = []
        jobs = ["management", "technician", "entrepreneur", "blue-collar", "unknown", "retired", "admin.", "services"]
        marital_status = ["married", "single", "divorced"]
        education_levels = ["university.degree", "high.school", "basic.9y", "professional.course", "basic.4y"]
        
        for i in range(limit):
            lead = {
                "id": i + 1,
                "name": self._generate_customer_name(),
                "age": random.randint(18, 70),
                "job": random.choice(jobs),
                "marital": random.choice(marital_status),
                "education": random.choice(education_levels),
                "default": "no",
                "housing": random.choice(["yes", "no"]),
                "loan": random.choice(["yes", "no"]),
                "contact": "cellular",
                "month": random.choice(["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]),
                "day_of_week": random.choice(["mon", "tue", "wed", "thu", "fri"]),
                "campaign": random.randint(1, 5),
                "pdays": random.choice([999, -1, random.randint(0, 100)]),
                "previous": random.randint(0, 3),
                "poutcome": random.choice(["nonexistent", "failure", "success"]),
                "emp_var_rate": round(random.uniform(-3.4, 1.4), 1),
                "cons_price_idx": round(random.uniform(92.0, 95.0), 3),
                "cons_conf_idx": round(random.uniform(-50.0, -26.0), 1),
                "euribor3m": round(random.uniform(0.6, 5.0), 3),
                "nr_employed": round(random.uniform(4963.0, 5228.0), 1),
                "score": random.uniform(0.1, 0.9),
                "prediction": random.choice(["yes", "no"]),
                "status": random.choice(["New", "Contacted", "In Progress", "Converted", "Lost"]),
                "created_at": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            leads.append(lead)
        
        return leads
    
    def prepare_features_for_prediction(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare lead data features for ML model prediction.
        
        Args:
            lead_data: Raw lead data dictionary
            
        Returns:
            Processed features dictionary ready for ML model
        """
        # Base features that go directly to model
        features = {
            'age': lead_data.get('age', 30),
            'campaign': lead_data.get('campaign', 1),
            'previous': lead_data.get('previous', 0),
            'emp.var.rate': lead_data.get('emp_var_rate', -1.8),
            'cons.price.idx': lead_data.get('cons_price_idx', 92.893),
            'cons.conf.idx': lead_data.get('cons_conf_idx', -46.2),
            'euribor3m': lead_data.get('euribor3m', 1.313),
            'nr.employed': lead_data.get('nr_employed', 5099.1),
        }
        
        # Derived feature: pernah_dihubungi (previously contacted)
        pdays = lead_data.get('pdays', 999)
        features['pernah_dihubungi'] = 1 if pdays != 999 and pdays >= 0 else 0
        
        # One-hot encode categorical features
        job = lead_data.get('job', 'unknown')
        for job_type in ['blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 
                         'self-employed', 'services', 'student', 'technician', 'unemployed']:
            features[f'job_{job_type}'] = 1 if job == job_type else 0
        
        marital = lead_data.get('marital', 'single')
        for marital_type in ['married', 'single']:
            features[f'marital_{marital_type}'] = 1 if marital == marital_type else 0
        
        education = lead_data.get('education', 'high.school')
        for edu_type in ['basic.6y', 'basic.9y', 'high.school', 'illiterate', 
                         'professional.course', 'university.degree']:
            features[f'education_{edu_type}'] = 1 if education == edu_type else 0
        
        # Binary features
        features['default_yes'] = 1 if lead_data.get('default', 'no') == 'yes' else 0
        features['housing_yes'] = 1 if lead_data.get('housing', 'no') == 'yes' else 0
        features['loan_yes'] = 1 if lead_data.get('loan', 'no') == 'yes' else 0
        features['contact_telephone'] = 1 if lead_data.get('contact', 'cellular') == 'telephone' else 0
        
        # Month encoding
        month = lead_data.get('month', 'may')
        for month_type in ['aug', 'dec', 'jul', 'jun', 'mar', 'may', 'nov', 'oct', 'sep']:
            features[f'month_{month_type}'] = 1 if month == month_type else 0
        
        # Day of week encoding
        day_of_week = lead_data.get('day_of_week', 'mon')
        for day_type in ['mon', 'thu', 'tue', 'wed']:
            features[f'day_of_week_{day_type}'] = 1 if day_of_week == day_type else 0
        
        # Previous outcome encoding
        poutcome = lead_data.get('poutcome', 'nonexistent')
        for outcome_type in ['nonexistent', 'success']:
            features[f'poutcome_{outcome_type}'] = 1 if poutcome == outcome_type else 0
        
        return features
    
    def get_dataset_info(self) -> Dict[str, Any]:
        """Get information about the loaded dataset."""
        if self.df is None:
            return {"status": "Dataset not loaded", "records": 0, "features": []}
        
        return {
            "status": "Dataset loaded",
            "records": len(self.df),
            "features": list(self.df.columns),
            "target_distribution": self.df['y'].value_counts().to_dict() if 'y' in self.df.columns else {}
        }


# Global instance
bank_data_service = BankDataService()