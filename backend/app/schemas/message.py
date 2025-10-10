from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class MessageCreate(BaseModel):
    sender: str
    content: str

class MessageRead(MessageCreate):
    message_id: int
    session_id: UUID
    timestamp: datetime

    