from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.quiz import QuizCreate
router = APIRouter()

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
