from pydantic import BaseModel, EmailStr
from datetime import datetime

class ProgressCreate(BaseModel):
    no_of_quizzes_taken: int
    total_earned_score: float
    total_max_score: int
    percentage: float

class ProgressRead(ProgressCreate):
    progress_id: int
    user_id: int
    quiz_id: int
    created_at: datetime