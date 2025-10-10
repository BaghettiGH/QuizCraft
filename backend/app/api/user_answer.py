from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.user_answer import UserAnswerCreate
router = APIRouter()

@router.get("/answers")
def get_answers():
    supabase = get_supabase()
    response = supabase.table("User_Answer").select("*").execute()
    return response.data

@router.post("/answers")
def create_answers(answer: UserAnswerCreate):
    supabase = get_supabase()
    response = supabase.table("User_Answer").insert(answer.model_dump()).execute()
    print(response)
    return response.data

