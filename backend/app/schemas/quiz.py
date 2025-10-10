from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
class QuizCreate(BaseModel):
    score: int
    no_of_question: int
    is_finished: bool

class QuizRead(QuizCreate):
    quiz_id: UUID
    session_id: UUID
    timestamp_started: datetime
    timestamp_finished: datetime | None = None
