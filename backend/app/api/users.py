from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.user import UserCreate

router = APIRouter()

@router.get("/users")
def get_users():
    supabase = get_supabase()
    response = supabase.table("User").select("*").execute()
    return response.data

@router.post("/users")
def create_user(user:UserCreate):
    supabase = get_supabase()
    response = supabase.table("User").insert(user.model_dump()).execute()
    print(response)
    return response.data