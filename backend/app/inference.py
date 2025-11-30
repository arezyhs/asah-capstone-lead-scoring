"""
ML Model Inference Service

This module provides the ModelService class for loading and serving
ML models for lead scoring predictions.
"""

import os
import logging
from pathlib import Path
from typing import Dict, Any, List, Union, Optional

import pandas as pd
import xgboost

# Configure logging
logger = logging.getLogger(__name__)


class ModelService:
    """
    Machine Learning model service for lead scoring predictions.
    
    This service handles model loading, preprocessing, and inference.
    It supports both trained models (via joblib) and fallback dummy predictions.
    """
    
    def __init__(self, model_dir: Optional[str] = None):
        """
        Initialize the ModelService.
        
        Args:
            model_dir: Optional path to model directory. If None, uses default location.
        """
        self.model_version: str = "v0.0-dummy"
        self.expected_features: List[str] = []
        self.model: Optional[Any] = None
        self.scaler: Optional[Any] = None
        self.model_columns: Optional[List[str]] = None
        
        self._model_dir = model_dir or self._get_default_model_dir()
        self._load_artifacts()
    
    def _get_default_model_dir(self) -> str:
        """Get the default model directory path."""
        return str(Path(__file__).parent.parent / "models")
    
    def _load_artifacts(self) -> None:
        """
        Load ML model artifacts from disk.
        
        Attempts to load model, scaler, and feature columns.
        Falls back to dummy mode if artifacts are not available.
        """
        try:
            import joblib
            
            model_path = Path(self._model_dir) / "model_final_xgb.pkl"
            scaler_path = Path(self._model_dir) / "scaler.pkl" 
            cols_path = Path(self._model_dir) / "model_columns.pkl"
            
            # Load model
            if model_path.exists():
                self.model = joblib.load(model_path)
                self.model_version = getattr(self.model, "version", "v1.0")
                logger.info(f"Loaded model from {model_path}")
            else:
                logger.warning(f"Model file not found: {model_path}")
            
            # Load scaler
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
                logger.info(f"Loaded scaler from {scaler_path}")
            else:
                logger.warning(f"Scaler file not found: {scaler_path}")
            
            # Load feature columns
            if cols_path.exists():
                self.model_columns = joblib.load(cols_path)
                self.expected_features = self.model_columns.copy()
                logger.info(f"Loaded {len(self.model_columns)} feature columns")
            else:
                logger.warning(f"Model columns file not found: {cols_path}")
                
        except Exception as e:
            logger.error(f"Error loading model artifacts: {e}")
            self.model = None
            self.scaler = None
            self.model_columns = None
    
    def preprocess(self, features: Dict[str, Any]) -> Union[Dict[str, Any], pd.DataFrame]:
        """
        Preprocess input features for model prediction.
        
        Args:
            features: Dictionary of feature values
            
        Returns:
            Preprocessed features as DataFrame or dict
        """
        if self.model_columns is None:
            return features or {}
        
        try:
            # Create DataFrame with input features
            df = pd.DataFrame([features])
            
            # Add missing columns with default value 0
            for col in self.model_columns:
                if col not in df.columns:
                    df[col] = 0
            
            # Reorder columns to match model expectations
            df = df[self.model_columns]
            
            # Apply scaling if scaler is available
            if self.scaler is not None:
                try:
                    numeric_cols = [
                        c for c in df.columns 
                        if df[c].dtype in ["float64", "int64", "float32", "int32"]
                    ]
                    if numeric_cols:
                        df[numeric_cols] = self.scaler.transform(df[numeric_cols])
                except Exception as e:
                    logger.warning(f"Error applying scaler: {e}")
            
            return df
            
        except Exception as e:
            logger.error(f"Error in preprocessing: {e}")
            return features or {}
    
    def predict(self, features: Dict[str, Any]) -> float:
        """
        Generate lead score prediction.
        
        Args:
            features: Dictionary of feature values
            
        Returns:
            Probability score between 0.0 and 1.0
            
        Raises:
            ValueError: If features are invalid
        """
        if not features:
            raise ValueError("Features dictionary cannot be empty")
        
        try:
            preprocessed = self.preprocess(features)
            
            if self.model is None:
                # Fallback to dummy prediction
                return self._dummy_predict(preprocessed)
            else:
                # Use trained model
                if isinstance(preprocessed, pd.DataFrame):
                    probabilities = self.model.predict_proba(preprocessed)
                    return float(probabilities[0, 1])  # Return positive class probability
                else:
                    return self._dummy_predict(preprocessed)
                    
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            # Return neutral probability on error
            return 0.5
    
    def _dummy_predict(self, features: Union[Dict[str, Any], pd.DataFrame]) -> float:
        """
        Generate dummy prediction when model is not available.
        
        Args:
            features: Preprocessed features
            
        Returns:
            Dummy probability based on feature values
        """
        try:
            if isinstance(features, dict):
                numeric_values = [
                    v for v in features.values() 
                    if isinstance(v, (int, float))
                ]
            else:
                # pandas DataFrame
                numeric_values = features.select_dtypes(include=['number']).values.flatten()
            
            if len(numeric_values) > 0:
                avg = sum(numeric_values) / len(numeric_values)
                # Sigmoid-like transformation
                probability = max(0.0, min(1.0, avg / (abs(avg) + 1)))
                return float(probability)
            else:
                return 0.5  # Neutral probability
                
        except Exception as e:
            logger.warning(f"Error in dummy prediction: {e}")
            return 0.5
    
    def is_model_loaded(self) -> bool:
        """Check if a trained model is loaded."""
        return self.model is not None
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        return {
            "version": self.model_version,
            "model_loaded": self.is_model_loaded(),
            "scaler_loaded": self.scaler is not None,
            "feature_count": len(self.expected_features),
            "expected_features": self.expected_features.copy()
        }
