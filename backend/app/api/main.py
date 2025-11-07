from fastapi import FastAPI
from app.api import users, message, progress, question, quiz, study_material, user_answer, sessions, auth
from app.api import ai, explain
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse


app = FastAPI(title="QuizCraft API")
favicon_path = 'backend/app/static/favicon.ico'
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://quiz-craft-azure.vercel.app",
    "https://quiz-craft-api.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(sessions.router, prefix="/api", tags=["chat_sessions"])
app.include_router(message.router, prefix="/api", tags=["messages"])
app.include_router(progress.router, prefix="/api", tags=["progress"])
app.include_router(question.router, prefix="/api", tags=["question"])
app.include_router(study_material.router, prefix="/api", tags=["study_material"])
app.include_router(user_answer.router, prefix="/api", tags=["answer"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(explain.router, prefix="/ai", tags=["AI Explain"])
app.include_router(sessions.router)
app.include_router(message.router)
app.include_router(quiz.router)
app.include_router(question.router)
app.include_router(user_answer.router)
app.include_router(auth.router)



@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(favicon_path)

@app.get("/")
async def root():
    return {"message": "QuizCraft API is running"}