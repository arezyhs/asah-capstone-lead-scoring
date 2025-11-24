#!/usr/bin/env python
"""
Test feature order and exact matching
"""
import sys
from pathlib import Path
import joblib
import pandas as pd

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from app.data_service import bank_data_service

def test_feature_order():
    """Test if feature order matches model expectations."""
    print("🔍 Testing Feature Order...")
    print("=" * 60)
    
    # Get model expected features (in order)
    model_columns = joblib.load('models/model_columns.pkl')
    print(f"Model expects features in this order:")
    for i, col in enumerate(model_columns[:10], 1):
        print(f"   {i:2d}. {col}")
    print("   ...")
    
    # Generate sample features
    sample_lead_data = {
        'age': 40,
        'job': 'technician',
        'marital': 'married',
        'education': 'secondary',
        'default': 'no',
        'housing': 'yes',
        'loan': 'no',
        'contact': 'cellular',
        'month': 'may',
        'day_of_week': 'mon',
        'campaign': 2,
        'pdays': -1,
        'previous': 0,
        'poutcome': 'nonexistent',
        'emp_var_rate': -1.8,
        'cons_price_idx': 92.893,
        'cons_conf_idx': -46.2,
        'euribor3m': 1.313,
        'nr_employed': 5099.1
    }
    
    generated_features = bank_data_service.prepare_features_for_prediction(sample_lead_data)
    print(f"\nWe generate features in this order:")
    for i, col in enumerate(list(generated_features.keys())[:10], 1):
        print(f"   {i:2d}. {col}")
    print("   ...")
    
    # Create proper ordered DataFrame
    print(f"\n🔧 Creating properly ordered DataFrame:")
    ordered_features = pd.DataFrame(columns=model_columns)
    for col in model_columns:
        if col in generated_features:
            ordered_features.loc[0, col] = generated_features[col]
        else:
            print(f"   ❌ Missing: {col}")
            
    print(f"   ✅ Ordered DataFrame shape: {ordered_features.shape}")
    print(f"   ✅ Sample values: age={ordered_features.loc[0, 'age']}, job_technician={ordered_features.loc[0, 'job_technician']}")
    
    # Test with model
    print(f"\n🧪 Testing with actual model:")
    try:
        from app.inference import model_service
        # Try to predict using ordered features
        model = joblib.load('models/model_final_xgb.pkl')
        scaler = joblib.load('models/scaler.pkl')
        
        # Scale features
        scaled_features = scaler.transform(ordered_features)
        print(f"   ✅ Features scaled successfully")
        
        # Make prediction
        prediction = model.predict_proba(scaled_features)
        print(f"   ✅ Prediction successful: {prediction[0][1]:.4f}")
        
    except Exception as e:
        print(f"   ❌ Model test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_feature_order()