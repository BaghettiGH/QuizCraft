from pydantic import BaseModel, EmailStr

class MessageCreate(BaseModel):
    sender: str
    content: str
