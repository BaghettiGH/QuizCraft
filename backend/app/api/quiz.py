from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.quiz import QuizCreate
from app.api.ai import generate_quiz_from_text
from pydantic import BaseModel
router = APIRouter()

class NoteInput(BaseModel):
    text: str

@router.get("/quiz")
def get_quiz():
    supabase = get_supabase()
    response = supabase.table("Quiz").select("*").execute()
    return response.data

@router.post("/quiz")
def create_quiz(quiz:QuizCreate):
    supabase = get_supabase()
    response = supabase.table("Quiz").insert(quiz.model_dump()).execute()
    print(response)
    return response.data

@router.post("/generate-quiz")
def generate_quiz(input: NoteInput):
    quiz_data = generate_quiz_from_text(input.text)
    return {"quiz": quiz_data}


