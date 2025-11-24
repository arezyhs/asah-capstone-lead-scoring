#!/usr/bin/env python
"""
Debug leads endpoint untuk mengidentifikasi error 500
"""
import sys
from pathlib import Path
import traceback

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from app.data_service import bank_data_service
from app.inference import model_service

def debug_leads_endpoint():
    """Debug leads endpoint step by step."""
    print("🔍 Debugging /leads endpoint...")
    print("=" * 50)
    
    try:
        print("\n1. Testing data service:")
        sample_leads = bank_data_service.get_sample_leads(3)
        print(f"   ✅ Got {len(sample_leads)} leads from data service")
        
        print("\n2. Testing first lead:")
        if sample_leads:
            lead = sample_leads[0]
            print(f"   ✅ Lead data: {lead['name']}, {lead['age']}, {lead['job']}")
            
            print("\n3. Testing feature preparation:")
            features = bank_data_service.prepare_features_for_prediction(lead)
            print(f"   ✅ Features prepared: {len(features)} features")
            print(f"   ✅ Sample features: age={features.get('age')}, job_technician={features.get('job_technician')}")
            
            print("\n4. Testing ML prediction:")
            try:
                prediction_result = model_service.predict(features)
                print(f"   ✅ Prediction successful:")
                print(f"      - Probability: {prediction_result.get('probability')}")
                print(f"      - Prediction: {prediction_result.get('prediction')}")
                print(f"      - Score: {prediction_result.get('score')}")
            except Exception as e:
                print(f"   ❌ Prediction failed: {e}")
                print(f"   🔍 Traceback:")
                traceback.print_exc()
                
        print("\n" + "=" * 50)
        print("✅ Debug complete!")
        
    except Exception as e:
        print(f"❌ General error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    debug_leads_endpoint()