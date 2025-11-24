# 📚 Project Documentation

Dokumentasi tambahan untuk Lead Scoring Predictive Analytics System.

## 📁 Struktur Dokumentasi

- **README.md** (Root) - Dokumentasi utama dan quick start guide
- **CLEANUP.md** (Root) - Panduan cleaning project seperti flutter clean
- **backend/README.md** - Dokumentasi specific backend FastAPI
- **frontend/README.md** - Dokumentasi specific frontend React
- **ml/README.md** - Dokumentasi machine learning dan data science

## 🔗 Quick Links

- [📖 Main Documentation](../README.md) - Setup dan panduan lengkap
- [🧹 Project Cleanup](../CLEANUP.md) - Clean cache dan dependencies  
- [⚡ Backend API](../backend/README.md) - FastAPI server documentation
- [🎨 Frontend UI](../frontend/README.md) - React application guide
- [🤖 ML Pipeline](../ml/README.md) - Machine learning workflow

## 📋 Additional Resources

- **API Documentation**: `http://localhost:8080/docs` (Swagger UI)
- **Project Plan**: [Project Plan - A25-CS065.pdf](../Project%20Plan%20-%20A25-CS065.pdf)
- **ML Notebook**: [EDA_Bank_Dataset_Additional_Full.ipynb](../ml/EDA_Bank_Dataset_Additional_Full.ipynb)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   ML Models     │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (.pkl files)  │
│   Port: 5173    │    │   Port: 8080    │    │   /models/      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Development Workflow

1. **Setup Environment** - Install dependencies
2. **Development** - Code dengan hot reload
3. **Testing** - Test integration frontend-backend
4. **Cleanup** - Clean cache dan rebuild
5. **Deployment** - Production build dan deploy

## 🚨 Troubleshooting

### Common Issues:
- **Port Conflicts**: Change ports in config files
- **Import Errors**: Check virtual environment activation
- **CORS Issues**: Verify backend CORS settings
- **Node Modules**: Delete and reinstall if corrupted

### Solutions:
1. Run cleanup script: `../CLEANUP.md`
2. Check environment variables
3. Verify all services are running
4. Check console for error messages