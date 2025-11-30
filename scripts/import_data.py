import sys
import os
import pandas as pd
import time
import logging

# Setup agar script bisa membaca modul 'app'
sys.path.append(os.getcwd())

from app.database import SessionLocal, engine, Base
from app.inference import ModelService
# Import models. Pastikan file models.py sudah ada di folder app/
# Jika error, cek apakah nama filenya benar 'models.py'
from app import models 

# Konfigurasi Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def import_csv_data(csv_path, limit=None):
    """
    Membaca CSV, memprediksi skor dengan ML, dan menyimpan ke Database.
    """
    logger.info(f"📂 Membaca file: {csv_path}")
    
    # Inisialisasi Database & Model ML
    db = SessionLocal()
    model_service = ModelService()
    
    # Cek koneksi model
    if not model_service.is_model_loaded():
        logger.error("❌ Model ML gagal dimuat. Pastikan file .pkl ada di backend/models/")
        return

    # 1. BACA CSV
    try:
        # Dataset bank.csv Anda menggunakan pemisah titik koma (;)
        df_raw = pd.read_csv(csv_path, sep=';')
    except Exception as e:
        logger.error(f"❌ Error membaca CSV: {e}")
        return

    # Batasi jumlah data jika diminta (misal hanya 100 data untuk tes)
    if limit:
        df_raw = df_raw.head(limit)
    
    total_data = len(df_raw)
    logger.info(f"🤖 Mulai memproses {total_data} data dengan Model AI...")
    
    # 2. PREPROCESSING MASSAL
    # Ubah data teks menjadi angka (One-Hot Encoding) agar dimengerti Model
    df_encoded = pd.get_dummies(df_raw)
    
    # Pastikan kolom sesuai dengan yang dipelajari model (isi 0 jika kolom tidak ada)
    for col in model_service.model_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
            
    success_count = 0
    
    # 3. LOOPING & PREDIKSI
    for index, row in df_raw.iterrows():
        try:
            # --- A. PREDIKSI SKOR ---
            features_dict = df_encoded.iloc[index].to_dict()
            probability = model_service.predict(features_dict)
            score = int(round(probability * 100))
            
            # --- B. LOGIKA STATUS ---
            status_target = "yes" if score > 50 else "no"
            loan_status_label = "Has Loan" if (row.get('housing') == 'yes' or row.get('loan') == 'yes') else "No Loan"
            
            # --- C. SIMPAN KE DB ---
            # Kita gunakan ID unik kombinasi waktu agar tidak duplikat saat dites ulang
            unique_id = f"IMP-{int(time.time())}-{index}"
            
            generated_name = f"Nasabah-{str(index+1).zfill(3)}"
            
            new_lead = models.Lead(
                id=unique_id,
                customer_name=generated_name,
                probability_score=probability,
                score=score,
                job=row.get('job', 'unknown'),
                loan_status=loan_status_label,
                
                # Data Detail (JSON)
                key_information={
                    "customer_id": unique_id,
                    "customer_name": generated_name,
                    "probability_score": score,
                    "status_target": status_target
                },
                demographic_profile={
                    "age": int(row.get('age', 0)),
                    "job": row.get('job'),
                    "marital_status": row.get('marital'),
                    "education": row.get('education')
                },
                financial_profile={
                    "defaulted_credit": row.get('default'),
                    "average_balance": int(row.get('balance', 0)),
                    "housing_loan": row.get('housing'),
                    "personal_loan": row.get('loan')
                },
                campaign_history={
                    "last_contact_date": f"{row.get('day')} {row.get('month')}",
                    "contact_type": row.get('contact'),
                    "duration_seconds": int(row.get('duration', 0)),
                    "poutcome": row.get('poutcome'),
                    "campaign_contacts": int(row.get('campaign', 0)),
                    "days_since_previous": int(row.get('pdays', 0))
                }
            )
            
            db.add(new_lead)
            success_count += 1
            
            # Tampilkan progress setiap 50 data
            if success_count % 50 == 0:
                print(f"   ...berhasil import {success_count}/{total_data} data")

        except Exception as e:
            logger.warning(f"⚠️ Gagal baris {index}: {e}")
            continue

    db.commit()
    logger.info(f"✅ SELESAI! Berhasil menyimpan {success_count} data leads ke Database.")
    db.close()

if __name__ == "__main__":
    # Lokasi file CSV relatif dari folder backend
    csv_file_path = "../ml/dataset/bank.csv" 
    
    if os.path.exists(csv_file_path):
        # Kita import 100 data saja dulu agar cepat
        import_csv_data(csv_file_path, limit=100) 
    else:
        logger.error(f"❌ File tidak ditemukan: {csv_file_path}")
        print("Pastikan Anda menjalankan script ini dari dalam folder 'backend/'")