import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

# 1. Inisialisasi Aplikasi
app = FastAPI()

# 2. Load Model & Aset (Pastikan file .pkl ada di folder yang sama)
try:
    model = joblib.load('model_final_xgb.pkl')
    scaler = joblib.load('scaler.pkl')
    model_columns = joblib.load('model_columns.pkl')
    print("INFO: Model dan aset berhasil dimuat.")
except Exception as e:
    print(f"ERROR: Gagal memuat model. Pastikan file .pkl ada. Detail: {e}")

# 3. Definisikan Format Data Input (Sesuai data training Anda)
class NasabahData(BaseModel):
    # Data Demografis & Bank
    age: int
    job: str
    marital: str
    education: str
    default: str
    housing: str
    loan: str
    contact: str
    month: str
    day_of_week: str
    duration: int
    campaign: int
    pdays: int
    previous: int
    poutcome: str
    
    # Data Ekonomi Makro (Wajib diisi oleh Backend)
    emp_var_rate: float
    cons_price_idx: float
    cons_conf_idx: float
    euribor3m: float
    nr_employed: float  # Fitur terpenting!

# 4. Membuat Endpoint Prediksi (INI YANG TADI HILANG)
@app.post("/predict")
def predict_nasabah(data: NasabahData):
    try:
        # A. Konversi data JSON ke DataFrame
        df = pd.DataFrame([data.dict()])
        
        # B. Preprocessing (Ubah nama kolom agar sesuai format training)
        # Mengganti underscore di JSON (emp_var_rate) jadi titik (emp.var.rate)
        rename_dict = {
            'emp_var_rate': 'emp.var.rate',
            'cons_price_idx': 'cons.price.idx',
            'cons_conf_idx': 'cons.conf.idx',
            'nr_employed': 'nr.employed'
        }
        df = df.rename(columns=rename_dict)

        # C. One-Hot Encoding (Ubah teks jadi angka biner)
        df = pd.get_dummies(df)

        # D. Penyelarasan Kolom (CRITICAL STEP)
        # Pastikan kolom input persis sama dengan kolom saat training
        df = df.reindex(columns=model_columns, fill_value=0)

        # E. Scaling Kolom Numerik
        numeric_cols = ['age', 'campaign', 'previous', 'emp.var.rate', 
                        'cons.price.idx', 'cons.conf.idx', 'euribor3m', 'nr.employed']
        df[numeric_cols] = scaler.transform(df[numeric_cols])

        # F. Prediksi
        prediksi_label = model.predict(df)[0]
        probabilitas = model.predict_proba(df)[0][1]

        # G. Kembalikan Hasil ke Backend
        return {
            "prediksi_kelas": int(prediksi_label),
            "probabilitas": float(probabilitas),
            "pesan": "Potensial Deposit" if prediksi_label == 1 else "Tidak Tertarik"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan internal: {str(e)}")

# 5. Jalankan Server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)