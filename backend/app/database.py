from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ganti 'password123' dengan password PostgreSQL Anda yang sebenarnya
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:7980@localhost/lead_scoring"

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