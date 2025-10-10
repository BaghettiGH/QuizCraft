from pydantic import BaseModel, EmailStr

class AnswerCreate(BaseModel):
    answer: str
    is_correct: bool

