from pydantic import BaseModel, EmailStr
from uuid import UUID
class QuestionCreate(BaseModel):
    quiz_question: str
    correct_answer: str

class QuestionRead(QuestionCreate):
    question_id: int
    quiz_id: UUID
