# app/main.py
from fastapi import FastAPI
from app.core.database import Base, engine
from app.models.user import User

app = FastAPI()

# Create all tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Database setup complete!"}
