from fastapi import APIRouter
from app.services.supabase_client import get_supabase

router = APIRouter()

@router.get("/messages")
def get_users():
    supabase = get_supabase()
    response = supabase.table("Message").select("*").execute()
    return response.data

@router.post("/messages")
def create_user(user:dict):
    supabase = get_supabase()
    response = supabase.table("Message").insert(user).execute()
    print(response)
    return response.data