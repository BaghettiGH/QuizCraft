from pydantic import BaseModel, EmailStr

class SessionCreate(BaseModel):
    title: str
    mode: str
