import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


CLOUD_DATABASE_URL = 'postgresql://neondb_owner:npg_J4rlQk7VdwOu@ep-raspy-frog-a1iqlkz2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
SQLALCHEMY_DATABASE_URL = CLOUD_DATABASE_URL

if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()