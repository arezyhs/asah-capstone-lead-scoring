
# SalesPilot - Machine Learning Module

Modul ini bertugas melakukan prediksi lead scoring untuk memprioritaskan prospek dengan potensi konversi tertinggi, berbasis dataset Bank Marketing (UCI).

## 1. Dataset & EDA
- **Sumber:** Bank Marketing (UCI), 41.188 baris, 21 kolom
- **Target:** `y` (yes/no, berlangganan deposito)
- **Imbalance:** 88,7% 'no', 11,3% 'yes'
- **Missing values:** Tidak ada, namun ada nilai 'unknown' pada fitur kategorikal (diimputasi modus)
- **Fitur penting:**
	- Numerik: age, campaign, previous, emp.var.rate, cons.price.idx, cons.conf.idx, euribor3m, nr.employed
	- Kategorikal: job, marital, education, default, housing, loan, contact, month, day_of_week, poutcome
- **Catatan:** Fitur `duration` dihapus untuk menghindari data leakage

## 2. Preprocessing & Feature Engineering
- Imputasi modus untuk nilai 'unknown' pada fitur kategorikal
- Transformasi `pdays` → fitur biner `pernah_dihubungi`
- One-hot encoding pada fitur kategorikal
- Target encoding: 'yes'=1, 'no'=0
- Dataset final: 47 kolom (8 numerik, 1 biner, 37 one-hot, 1 target)

## 3. Modeling
- **Model utama:** XGBoost
- **Penanganan imbalance:** scale_pos_weight, class_weight, atau teknik lain
- **Evaluasi:**
	- Akurasi: ~86%
	- Confusion matrix, precision, recall, f1-score
	- Model lebih baik mengenali kelas mayoritas, recall kelas minoritas cukup baik
- **Fitur penting:** indikator ekonomi, status pekerjaan, riwayat kontak

## 4. Deployment
- Model di-deploy sebagai API FastAPI
- Endpoint utama: `/predict` (POST)
- Input: data demografis & finansial lead (JSON)
- Output: probabilitas konversi

### Contoh Request
```json
{
	"age": 35,
	"job": "admin.",
	"marital": "married",
	"education": "university.degree",
	"default": "no",
	"housing": "yes",
	"loan": "no",
	"contact": "cellular",
	"month": "may",
	"day_of_week": "mon",
	"campaign": 2,
	"pdays": 999,
	"previous": 0,
	"poutcome": "nonexistent",
	"emp.var.rate": 1.1,
	"cons.price.idx": 93.994,
	"cons.conf.idx": -36.4,
	"euribor3m": 4.857,
	"nr.employed": 5191
}
```

### Contoh Response
```json
{
	"probability": 0.23,
	"prediction": 0
}
```

## 5. Struktur Folder
- `app.py` : entry point API ML
- `dataset/` : dataset Bank Marketing (csv)
- `notebooks/` : EDA, modeling, preprocessing
- `requirements.txt` : dependensi Python

## 6. Setup & Instalasi
1. Masuk ke folder ml:
	 ```bash
	 cd ml
	 ```
2. Install dependencies:
	 ```bash
	 pip install -r requirements.txt
	 ```
3. Jalankan API ML (FastAPI):
	 ```bash
	 uvicorn app:app --host 0.0.0.0 --port 8001
	 ```

## 7. Pengembangan & Testing
- Model dan pipeline dapat diupdate di notebook modeling
- Dataset utama: `dataset/bank-full.csv`
- Untuk pengujian, gunakan payload contoh di `../docs/sample_payloads.json`

## 8. Tech Stack
- Python 3.13
- XGBoost
- scikit-learn
- pandas, numpy
- FastAPI

## 9. Insight Bisnis
- Model membantu memprioritaskan prospek dengan potensi konversi tertinggi
- Insight segmentasi: profesi, pendidikan, dan indikator ekonomi berpengaruh pada konversi
- Rekomendasi: fokus pada segmen dengan probabilitas tinggi untuk meningkatkan efektivitas kampanye

---