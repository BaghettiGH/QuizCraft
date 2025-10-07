from fastapi import APIRouter
from app.services.supabase_client import get_supabase

router = APIRouter()

@router.get("/chat_sessions")
def get_users():
    supabase = get_supabase()
    response = supabase.table("Chat_Session").select("*").execute()
    return response.data

@router.post("/chat_sessions")
def create_user(user:dict):
    supabase = get_supabase()
    response = supabase.table("Chat_Session").insert(user).execute()
    print(response)
    return response.data