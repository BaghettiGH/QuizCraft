from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
class StudyMaterialCreate(BaseModel):
    file_name: str
    file_path: str
    file_type: str
class StudyMaterialRead(StudyMaterialCreate):
    material_id: int
    user_id: int
    session_id: UUID
    upload_date: datetime
