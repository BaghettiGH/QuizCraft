from pydantic import BaseModel, EmailStr

class QuestionCreate(BaseModel):
    quiz_question: str
    correct_answer: str
    