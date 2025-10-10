from pydantic import BaseModel, EmailStr

class StudyMaterialCreate(BaseModel):
    file_name: str
    file_path: str
    file_type: str
