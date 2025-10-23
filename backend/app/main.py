from fastapi import FastAPI
from app.api import users, chat_session, message, progress, question, quiz, study_material, user_answer
from app.api import ai, explain
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="QuizCraft API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(chat_session.router, prefix="/api", tags=["chat_sessions"])
app.include_router(message.router, prefix="/api", tags=["messages"])
app.include_router(progress.router, prefix="/api", tags=["progress"])
app.include_router(question.router, prefix="/api", tags=["question"])
app.include_router(quiz.router, prefix="/api", tags=["quiz"])
app.include_router(study_material.router, prefix="/api", tags=["study_material"])
app.include_router(user_answer.router, prefix="/api", tags=["answer"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(explain.router, prefix="/ai", tags=["AI Explain"])