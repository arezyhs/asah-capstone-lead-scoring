#!/usr/bin/env python
"""
Compare features generated vs model expected features
"""
import sys
from pathlib import Path
import joblib

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from app.data_service import bank_data_service

def compare_features():
    """Compare generated features with model expected features."""
    print("🔍 Comparing Features...")
    print("=" * 60)
    
    # Get model expected features
    model_columns = joblib.load('models/model_columns.pkl')
    print(f"Model expects {len(model_columns)} features")
    
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
    print(f"Data service generates {len(generated_features)} features")
    
    # Find differences
    model_set = set(model_columns)
    generated_set = set(generated_features.keys())
    
    missing_from_generated = model_set - generated_set
    extra_in_generated = generated_set - model_set
    
    print(f"\n📊 Analysis:")
    print(f"   - Model expects: {len(model_set)} features")
    print(f"   - We generate: {len(generated_set)} features")
    print(f"   - Missing from our generation: {len(missing_from_generated)}")
    print(f"   - Extra in our generation: {len(extra_in_generated)}")
    
    if missing_from_generated:
        print(f"\n❌ Missing features (model expects but we don't generate):")
        for feature in sorted(missing_from_generated):
            print(f"   - {feature}")
    
    if extra_in_generated:
        print(f"\n⚠️  Extra features (we generate but model doesn't expect):")
        for feature in sorted(extra_in_generated):
            print(f"   - {feature}")
    
    # Show common features for verification
    common_features = model_set & generated_set
    print(f"\n✅ Common features ({len(common_features)}):")
    for feature in sorted(common_features)[:10]:
        print(f"   - {feature}")
    if len(common_features) > 10:
        print(f"   ... and {len(common_features) - 10} more")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    compare_features()