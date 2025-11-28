"""
ML Model Inference Service for Bank Marketing Lead Scoring

This module provides the ModelService class for loading and serving
real XGBoost models trained on bank marketing dataset.
"""

import os
import logging
import joblib
import numpy as np
from pathlib import Path
from typing import Dict, Any, List, Union, Optional

import pandas as pd

# Configure logging
logger = logging.getLogger(__name__)


class ModelService:
    """
    Machine Learning model service for bank marketing lead scoring predictions.
    
    This service handles loading real XGBoost model, scaler, and feature columns
    trained on bank marketing dataset. Provides feature preprocessing and inference.
    """
    
    def __init__(self, model_dir: Optional[str] = None):
        """
        Initialize the ModelService.
        
        Args:
            model_dir: Optional path to model directory. If None, uses default location.
        """
        self.model_version: str = "v1.0-xgb-bank"
        self.model: Optional[Any] = None
        self.scaler: Optional[Any] = None
        self.model_columns: Optional[List[str]] = None
        self.is_loaded: bool = False
        
        self._model_dir = model_dir or self._get_default_model_dir()
        self._load_artifacts()
    
    def _get_default_model_dir(self) -> str:
        """Get the default model directory path."""
        return str(Path(__file__).parent.parent / "models")
    
    def _load_artifacts(self) -> None:
        """
        Load ML model artifacts from disk.
        
        Loads XGBoost model, StandardScaler, and feature columns list.
        Falls back to dummy mode if artifacts are not available.
        """
        try:
            model_path = Path(self._model_dir) / "model_final_xgb.pkl"
            scaler_path = Path(self._model_dir) / "scaler.pkl" 
            cols_path = Path(self._model_dir) / "model_columns.pkl"
            
            # Load XGBoost model
            if model_path.exists():
                self.model = joblib.load(model_path)
                logger.info(f"✅ Loaded XGBoost model from {model_path}")
            else:
                logger.warning(f"❌ Model file not found: {model_path}")
                return
            
            # Load StandardScaler
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
                logger.info(f"✅ Loaded scaler from {scaler_path}")
            else:
                logger.warning(f"❌ Scaler file not found: {scaler_path}")
                return
            
            # Load feature columns
            if cols_path.exists():
                self.model_columns = joblib.load(cols_path)
                logger.info(f"✅ Loaded {len(self.model_columns)} feature columns")
                logger.info(f"🔧 Expected features: {self.model_columns[:5]}... (showing first 5)")
                self.is_loaded = True
            else:
                logger.warning(f"❌ Model columns file not found: {cols_path}")
                return
                
        except Exception as e:
            logger.error(f"❌ Error loading model artifacts: {e}")
            self.model = None
            self.scaler = None
            self.model_columns = None
            self.is_loaded = False
    
    def prepare_features(self, raw_features: Dict[str, Any]) -> pd.DataFrame:
        """
        Convert raw features to model-ready DataFrame.
        
        Args:
            raw_features: Raw feature dictionary from API request
            
        Returns:
            DataFrame with features matching model expectations
        """
        if not self.model_columns:
            raise ValueError("Model columns not loaded")
        
        # Initialize feature vector with zeros
        features = pd.DataFrame([{col: 0 for col in self.model_columns}])
        
        # Fill in base numerical features
        numerical_mapping = {
            'age': 'age',
            'campaign': 'campaign',
            'previous': 'previous',
            'emp_var_rate': 'emp.var.rate',
            'cons_price_idx': 'cons.price.idx',
            'cons_conf_idx': 'cons.conf.idx',
            'euribor3m': 'euribor3m',
            'nr_employed': 'nr.employed'
        }
        
        for api_key, model_key in numerical_mapping.items():
            if model_key in features.columns and api_key in raw_features:
                features.loc[0, model_key] = raw_features[api_key]
        
        # Handle pernah_dihubungi feature
        if 'pernah_dihubungi' in features.columns:
            pdays = raw_features.get('pdays', 999)
            features.loc[0, 'pernah_dihubungi'] = 1 if (pdays != 999 and pdays >= 0) else 0
        
        # One-hot encode job
        job = raw_features.get('job', 'unknown')
        job_column = f'job_{job}'
        if job_column in features.columns:
            features.loc[0, job_column] = 1
        
        # One-hot encode marital status
        marital = raw_features.get('marital', 'single')
        marital_column = f'marital_{marital}'
        if marital_column in features.columns:
            features.loc[0, marital_column] = 1
        
        # One-hot encode education
        education = raw_features.get('education', 'high.school')
        education_column = f'education_{education}'
        if education_column in features.columns:
            features.loc[0, education_column] = 1
        
        # Binary features
        binary_mappings = {
            'default': 'default_yes',
            'housing': 'housing_yes', 
            'loan': 'loan_yes'
        }
        
        for api_key, model_key in binary_mappings.items():
            if model_key in features.columns:
                features.loc[0, model_key] = 1 if raw_features.get(api_key, 'no') == 'yes' else 0
        
        # Contact type
        if 'contact_telephone' in features.columns:
            features.loc[0, 'contact_telephone'] = 1 if raw_features.get('contact', 'cellular') == 'telephone' else 0
        
        # Month
        month = raw_features.get('month', 'may')
        month_column = f'month_{month}'
        if month_column in features.columns:
            features.loc[0, month_column] = 1
        
        # Day of week
        day_of_week = raw_features.get('day_of_week', 'mon')
        day_column = f'day_of_week_{day_of_week}'
        if day_column in features.columns:
            features.loc[0, day_column] = 1
        
        # Previous outcome
        poutcome = raw_features.get('poutcome', 'nonexistent')
        poutcome_column = f'poutcome_{poutcome}'
        if poutcome_column in features.columns:
            features.loc[0, poutcome_column] = 1
        
        return features
    
    def predict(self, raw_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make prediction using the loaded XGBoost model.
        
        Args:
            raw_features: Raw feature dictionary
            
        Returns:
            Dictionary containing prediction results
        """
        if not self.is_loaded:
            return self._dummy_prediction(raw_features)
        
        try:
            # Prepare features
            features_df = self.prepare_features(raw_features)
            
            # Extract only numerical features that the scaler was trained on
            numerical_features = ['age', 'campaign', 'previous', 'emp.var.rate', 
                                'cons.price.idx', 'cons.conf.idx', 'euribor3m', 'nr.employed']
            
            # Scale only the numerical features
            numerical_data = features_df[numerical_features].values
            scaled_numerical = self.scaler.transform(numerical_data)
            
            # Replace numerical columns with scaled values
            features_scaled = features_df.copy()
            features_scaled[numerical_features] = scaled_numerical
            
            # Get prediction probability using all 46 features (scaled numerical + categorical)
            prediction_proba = self.model.predict_proba(features_scaled.values)[0]
            probability = float(prediction_proba[1])  # Probability of 'yes' class
            
            # Get binary prediction  
            prediction = self.model.predict(features_scaled.values)[0]
            prediction_label = "yes" if prediction == 1 else "no"
            
            # Determine risk category
            if probability >= 0.7:
                risk_category = "High"
            elif probability >= 0.4:
                risk_category = "Medium"
            else:
                risk_category = "Low"
            
            return {
                "probability": probability,
                "score": int(probability * 100),
                "prediction": prediction_label,
                "risk_category": risk_category,
                "model_version": self.model_version,
                "features_used": len(self.model_columns)
            }
            
        except Exception as e:
            logger.error(f"❌ Prediction error: {e}")
            return self._dummy_prediction(raw_features)
    
    def _dummy_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate dummy prediction when model is not available.
        
        Args:
            features: Feature dictionary
            
        Returns:
            Dummy prediction results
        """
        # Simple dummy logic based on age and job
        age = features.get('age', 30)
        job = features.get('job', 'unknown')
        housing = features.get('housing', 'no')
        
        # Basic scoring logic
        base_score = 0.3
        
        if age < 30:
            base_score += 0.2
        elif age > 60:
            base_score -= 0.1
        
        if job in ['management', 'technician', 'admin.']:
            base_score += 0.2
        elif job in ['student', 'unemployed']:
            base_score -= 0.1
        
        if housing == 'no':
            base_score += 0.1
        
        probability = max(0.1, min(0.9, base_score))
        prediction_label = "yes" if probability > 0.5 else "no"
        
        if probability >= 0.7:
            risk_category = "High"
        elif probability >= 0.4:
            risk_category = "Medium"
        else:
            risk_category = "Low"
        
        return {
            "probability": probability,
            "score": int(probability * 100),
            "prediction": prediction_label,
            "risk_category": risk_category,
            "model_version": "v0.0-dummy",
            "features_used": len(features)
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get comprehensive model information."""
        return {
            "version": self.model_version,
            "model_loaded": self.is_loaded,
            "model_type": "XGBoost" if self.is_loaded else "Dummy",
            "scaler_loaded": self.scaler is not None,
            "feature_count": len(self.model_columns) if self.model_columns else 0,
            "expected_features": self.model_columns[:10] if self.model_columns else [],  # First 10 for brevity
            "model_path": self._model_dir
        }
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the XGBoost model."""
        if not self.is_loaded or not hasattr(self.model, 'feature_importances_'):
            return {}
        
        try:
            importance_dict = {}
            for i, importance in enumerate(self.model.feature_importances_):
                if i < len(self.model_columns):
                    importance_dict[self.model_columns[i]] = float(importance)
            
            # Return top 15 most important features
            sorted_features = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
            return dict(sorted_features[:15])
            
        except Exception as e:
            logger.error(f"Error getting feature importance: {e}")
            return {}


# Global instance
model_service = ModelService()