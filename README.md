# 🎯 Lead Scoring Predictive Analytics System

**Capstone Project A25-CS065** - Sistem prediksi lead scoring berbasis Machine Learning dengan arsitektur full-stack modern.

## 🕴️ Anggota
- Akbar Rezy Hanara Setiyawan R284D5Y0128
- Fayzul Haq 
- Ahmad Misbach
- Augie Bryan Athalla M296D5Y0308
- Bram Prastyo Nugroho

## 📋 Deskripsi Proyek

Sistem ini menggunakan Machine Learning untuk memprediksi probabilitas konversi lead menjadi customer, membantu tim sales memprioritaskan prospek dengan akurasi tinggi.

### ✨ Fitur Utama
- 🤖 **ML Prediction Engine** - Model XGBoost untuk prediksi lead scoring
- 🔐 **Authentication System** - Login security dengan JWT
- 📊 **Interactive Dashboard** - Real-time lead analytics dan visualisasi
- 🔍 **Advanced Filtering** - Sort, search, dan filter leads
- 📱 **Responsive Design** - Mobile-friendly interface
- ⚡ **Real-time API** - RESTful API dengan dokumentasi lengkap

---

## 🗂️ Struktur Proyek

```
asah-capstone-lead-scoring/
├── 📁 backend/                 # FastAPI Backend Server
│   ├── app/
│   │   ├── main.py            # FastAPI application & routes
│   │   ├── schemas.py         # Pydantic data models
│   │   ├── inference.py       # ML model service
│   │   ├── config.py          # Application settings
│   │   ├── database.py        # Data access layer
│   │   └── auth.py            # Authentication utilities
│   ├── models/                # ML model artifacts (.pkl files)
│   ├── .venv/                 # Python virtual environment
│   └── requirements.txt       # Python dependencies
│
├── 📁 frontend/               # React Frontend Application
│   └── predictive-lead-score/
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── pages/         # Application pages
│       │   ├── api/           # API service layer
│       │   └── App.jsx        # Main React app
│       ├── public/            # Static assets
│       └── package.json       # Node dependencies
│
├── 📁 ml/                     # Machine Learning Development
│   ├── EDA_Bank_Dataset_Additional_Full.ipynb
│   └── README.md              # ML documentation
│
├── 📁 docs/                   # Project documentation
│   └── README.md              # Additional docs
│
└── 📁 .venv/                  # Global Python environment
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.8+** dengan pip
- **Node.js 16+** dengan npm
- **Git** untuk clone repository

### 1️⃣ Clone Repository
```bash
git clone https://github.com/arezyhs/asah-capstone-lead-scoring.git
cd asah-capstone-lead-scoring
```

### 2️⃣ Setup Backend (FastAPI)
```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv .venv

# Aktifkan virtual environment
.venv\Scripts\activate    # Windows
source .venv/bin/activate # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn app.main:app --reload --port 8080
```

**Backend running di:** `http://localhost:8080`

### 3️⃣ Setup Frontend (React + Vite)
```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend/predictive-lead-score

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

**Frontend running di:** `http://localhost:5173`

---

## 🔧 Environment Configuration

### Backend (.env)
Buat file `.env` di folder `backend/`:
```env
APP_NAME=Lead Scoring Inference API
DEBUG=false
HOST=127.0.0.1
PORT=8080
SECRET_KEY=your-super-secret-key-here
LOG_LEVEL=INFO
```

### Default Login
```
Username: sales_user_01
Password: password123
```

---

## 🎨 API Documentation

### 🏥 Health & Monitoring
- `GET /health` - API health status
- `GET /metadata` - ML model information

### 🔐 Authentication
- `POST /api/auth/login` - User login

### 👥 Lead Management  
- `GET /leads` - Get all leads (with filtering)
- `GET /leads/{id}` - Get specific lead detail
- `GET /notes` - Get lead notes

### 🤖 ML Predictions
- `POST /predict` - Generate lead score prediction

**API Docs:** `http://localhost:8080/docs` (Swagger UI)

---

## 🛠️ Development

### Backend Development
```bash
cd backend

# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload --port 8080

# Run tests (jika ada)
pytest
```

### Frontend Development  
```bash
cd frontend/predictive-lead-score

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🧹 Clean Project (seperti flutter clean)
```bash
# Clean backend
cd backend
Remove-Item -Recurse -Force __pycache__, .pytest_cache

# Clean frontend
cd frontend/predictive-lead-score  
Remove-Item -Recurse -Force node_modules, dist, .vite
npm install  # Re-install dependencies
```

---

## 📚 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation dan serialization
- **scikit-learn/XGBoost** - Machine learning models
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool dan dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Navigation

### ML/Data Science
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing  
- **Joblib** - Model serialization
- **Jupyter** - Data exploration

---

## 🚀 Production Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8080
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to web server (Vercel, Netlify, etc.)
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

**A25-CS065 Team**
- Lead scoring system dengan arsitektur modern
- Full-stack integration ML to production
- Professional software development practices

---

**Happy Coding! 🚀**