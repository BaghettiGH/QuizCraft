from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.chat_session import SessionCreate

router = APIRouter()

@router.get("/chat_sessions")
def get_session(user_id:str):
    supabase = get_supabase()
    response = supabase.table("Chat_Session").select("*").eq("user_id", user_id).order("last_active_at", desc=True).execute()
    return response.data

@router.post("/chat_sessions")
def create_session(session:SessionCreate):
    supabase = get_supabase()
    response = supabase.table("Chat_Session").insert(session.model_dump()).execute()
    print(response)
    return response.data