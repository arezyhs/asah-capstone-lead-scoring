# 🧹 Project Cleanup Guide

Panduan untuk membersihkan project (seperti `flutter clean`) untuk menghapus cache dan temporary files.

## Backend Cleanup

```bash
cd backend

# Hapus Python cache
Remove-Item -Recurse -Force __pycache__ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force app/__pycache__ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .pytest_cache -ErrorAction SilentlyContinue

# Hapus virtual environment (opsional - akan perlu install ulang)
Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue

# Re-create virtual environment
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Frontend Cleanup

```bash
cd frontend/predictive-lead-score

# Hapus node_modules dan cache
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .vite -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Re-install dependencies
npm install
```

## Complete Project Reset

```bash
# Dari root directory project
Remove-Item -Recurse -Force backend/__pycache__ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend/app/__pycache__ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/predictive-lead-score/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/predictive-lead-score/dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/predictive-lead-score/.vite -ErrorAction SilentlyContinue

# Re-setup backend
cd backend
.venv\Scripts\activate
pip install -r requirements.txt

# Re-setup frontend  
cd ../frontend/predictive-lead-score
npm install
```

## Git Cleanup

```bash
# Clean git cache dan untracked files
git clean -fd
git gc --prune=now
```

Setelah cleanup, jalankan kembali:
- Backend: `uvicorn app.main:app --reload --port 8080`  
- Frontend: `npm run dev`