from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.message import MessageCreate

router = APIRouter()

@router.get("/messages")
def get_message():
    supabase = get_supabase()
    response = supabase.table("Message").select("*").execute()
    return response.data

@router.post("/messages")
def create_message(message:MessageCreate):
    supabase = get_supabase()
    response = supabase.table("Message").insert(message.model_dump()).execute()
    print(response)
    return response.data