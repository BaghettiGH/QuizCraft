from fastapi import APIRouter
from app.services.supabase_client import get_supabase

router = APIRouter()

@router.get("/study_materials")
def get_users():
    supabase = get_supabase()
    response = supabase.table("Study_Material").select("*").execute()
    return response.data

@router.post("/study_materials")
def create_user(user:dict):
    supabase = get_supabase()
    response = supabase.table("Study_Material").insert(user).execute()
    print(response)
    return response.data