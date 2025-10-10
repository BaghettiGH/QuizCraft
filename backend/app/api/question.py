from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.question import QuestionCreate
router = APIRouter()

@router.get("/question")
def get_question():
    supabase = get_supabase()
    response = supabase.table("Question").select("*").execute()
    return response.data

@router.post("/question")
def create_question(question: QuestionCreate):
    supabase = get_supabase()
    response = supabase.table("Question").insert(question.model_dump()).execute()
    print(response)
    return response.data