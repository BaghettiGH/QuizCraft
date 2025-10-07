from fastapi import FastAPI
from app.api import users

app = FastAPI(title="QuizCraft API")

app.include_router(users.router, prefix="/api", tags=["users"])
