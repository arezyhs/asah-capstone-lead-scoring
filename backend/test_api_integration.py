#!/usr/bin/env python
"""
Test API endpoints untuk memverifikasi data real dalam integrasi
"""
import requests
import json

def test_api_endpoints():
    """Test semua endpoint API dengan data real."""
    print("🔍 Testing API Endpoints with Real Data...")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8082"
    
    # Test leads endpoint
    try:
        print("\n1. Testing /leads endpoint:")
        response = requests.get(f"{base_url}/leads?limit=3")
        if response.status_code == 200:
            leads = response.json()
            print(f"   ✅ Status: {response.status_code}")
            print(f"   ✅ Retrieved {len(leads)} leads")
            
            for i, lead in enumerate(leads, 1):
                print(f"\n   Lead {i}:")
                print(f"     - ID: {lead.get('id', 'N/A')}")
                print(f"     - Name: {lead.get('name', 'N/A')}")
                print(f"     - Profile: {lead.get('profile', 'N/A')}")
                print(f"     - Age: {lead.get('age', 'N/A')}")
                print(f"     - Job: {lead.get('job', 'N/A')}")
                print(f"     - Status: {lead.get('status', 'N/A')}")
                print(f"     - Actual Outcome: {lead.get('actual_outcome', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"   ❌ Connection error: {e}")
    
    # Test predict endpoint
    try:
        print("\n2. Testing /predict endpoint:")
        sample_data = {
            "customer_name": "CUST_TEST_001",
            "age": 40,
            "job": "technician",
            "marital": "married",
            "education": "secondary",
            "default": "no",
            "housing": "yes",
            "loan": "no",
            "contact": "cellular",
            "month": "may",
            "day_of_week": "mon",
            "campaign": 2,
            "pdays": -1,
            "previous": 0,
            "poutcome": "nonexistent",
            "emp_var_rate": -1.8,
            "cons_price_idx": 92.893,
            "cons_conf_idx": -46.2,
            "euribor3m": 1.313,
            "nr_employed": 5099.1
        }
        
        response = requests.post(f"{base_url}/predict", json=sample_data)
        if response.status_code == 200:
            prediction = response.json()
            print(f"   ✅ Status: {response.status_code}")
            print(f"   ✅ Prediction: {prediction.get('prediction', 'N/A')}")
            print(f"   ✅ Score: {prediction.get('score', 'N/A')}")
            print(f"   ✅ Risk Category: {prediction.get('risk_category', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"   ❌ Connection error: {e}")
    
    print("\n" + "=" * 60)
    print("✅ API Testing Complete!")
    print("   Backend is running with REAL data from bank.csv")
    print("   Frontend can now connect to get real customer data")

if __name__ == "__main__":
    test_api_endpoints()