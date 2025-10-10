from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.study_material import StudyMaterialCreate
router = APIRouter()

@router.get("/study_material")
def get_materials():
    supabase = get_supabase()
    response = supabase.table("Study_Material").select("*").execute()
    return response.data

@router.post("/study_material")
def create_materials(study_material:StudyMaterialCreate):
    supabase = get_supabase()
    response = supabase.table("Study_Material").insert(study_material.model_dump()).execute()
    print(response)
    return response.data