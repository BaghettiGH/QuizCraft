from fastapi import APIRouter
from app.services.supabase_client import get_supabase

router = APIRouter()

@router.get("/users")
def get_users():
    supabase = get_supabase()
    response = supabase.table("User").select("*").execute()
    return response.data

@router.post("/users")
def create_user(user:dict):
    supabase = get_supabase()
    response = supabase.table("User").insert(user).execute()
    print(response)
    return response.data