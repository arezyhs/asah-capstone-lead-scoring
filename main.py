# Railway entry point - expose FastAPI app at root level
from app.main import app

# This allows Railway to find the app with: uvicorn main:app