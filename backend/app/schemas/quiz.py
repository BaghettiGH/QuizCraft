from pydantic import BaseModel, EmailStr

class QuizCreate(BaseModel):
    score: int
    no_of_question: int
    is_finished: bool
    