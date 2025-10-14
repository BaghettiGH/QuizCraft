from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserAnswerCreate(BaseModel):
    answer: str
    is_correct: bool
class AnswerRead(UserAnswerCreate):
    user_answer_id:int
    created_at: datetime
    question_id: int

