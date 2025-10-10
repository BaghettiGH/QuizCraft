from pydantic import BaseModel, EmailStr

class ProgressCreate(BaseModel):
    no_of_quizzes_taken: int
    total_earned_score: float
    total_max_score: int
    percentage: float

