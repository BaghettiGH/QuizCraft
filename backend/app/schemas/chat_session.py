from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
class SessionCreate(BaseModel):
    title: str
    mode: str

class SessionRead(SessionCreate):
    session_id: UUID
    user_id: int
    created_at: datetime
    last_active_at: datetime