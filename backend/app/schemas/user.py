from pydantic import BaseModel, EmailStr
from datetime import datetime
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

class UserRead(UserCreate):
    user_id: int
    created_at: datetime

    # class Config:
    #     orm_mode = True