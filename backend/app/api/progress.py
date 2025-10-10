from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.progress import ProgressCreate
router = APIRouter()

@router.get("/progress")
def get_progress():
    supabase = get_supabase()
    response = supabase.table("Progress").select("*").execute()
    return response.data

@router.post("/progress")
def create_progress(progress:ProgressCreate):
    supabase = get_supabase()
    response = supabase.table("Progress").insert(progress.model_dump()).execute()
    print(response)
    return response.data