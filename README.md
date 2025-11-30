# 🎯 Lead Scoring Predictive Analytics

Web application untuk memprediksi skor lead menggunakan machine learning. Sistem ini membantu tim sales mengidentifikasi lead yang paling berpotensi untuk conversion.

## 🚀 Features

- **Predictive Lead Scoring** - ML model XGBoost untuk prediksi skor lead
- **Web Dashboard** - Interface React untuk monitoring dan analisis
- **Real-time API** - FastAPI backend dengan inference real-time
- **Lead Management** - CRUD operations untuk data lead

## 🏗️ Tech Stack

- **Backend**: FastAPI + PostgreSQL + XGBoost
- **Frontend**: React + Vite + TailwindCSS  
- **ML Model**: XGBoost Classifier
- **Deployment**: Railway (Backend) + Vercel (Frontend)

## ⚡ Quick Setup

### 1. Backend Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Database Setup
```bash
# Run import script to populate database
cd scripts
python import_data.py
```

## 🌐 Access

- **Backend API**: http://localhost:8000
- **Frontend Web**: http://localhost:5173
- **API Health**: http://localhost:8000/health

## 📁 Project Structure

```
├── app/           # FastAPI backend
├── frontend/      # React frontend
├── models/        # ML model files
├── deployment/    # Docker & deployment configs
├── docs/          # Documentation
├── scripts/       # Utility scripts
└── tests/         # Test files
```

## 🔑 Default Login

- **Username**: `sales_user_01`
- **Password**: `password123`

---
*Predictive Lead Scoring System - Capstone Project A25-CS065*