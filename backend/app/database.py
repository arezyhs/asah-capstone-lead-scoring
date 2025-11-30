import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use environment variable for production, fallback to local for development
DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql://postgres:1453SArezhhhh@localhost/lead_scoring"

# Railway PostgreSQL URLs sometimes need this fix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Fungsi dependency agar setiap request punya sesi database sendiri
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()