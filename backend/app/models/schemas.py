from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SessionCreate(BaseModel):
    user_id: int
    title: str = "New Chat"
    mode: str = "chat"

class SessionUpdate(BaseModel):
    title: Optional[str] = None
    last_active_at: Optional[datetime] = None

class SessionResponse(BaseModel):
    session_id: str
    user_id: int
    title: str
    mode: str
    created_at: datetime
    last_active_at: Optional[datetime]

class MessageCreate(BaseModel):
    session_id: str
    sender: str  # "user" or "assistant"
    content: str
    quiz_data: Optional[str] = None  # JSON string

class MessageResponse(BaseModel):
    message_id: str
    session_id: str
    sender: str
    content: str
    timestamp: datetime
    quiz_data: Optional[str] = None

class QuizCreate(BaseModel):
    session_id: str
    no_of_questions: int

class QuizUpdate(BaseModel):
    score: Optional[int] = None
    is_finished: Optional[bool] = None
    timestamp_finished: Optional[datetime] = None

class QuizResponse(BaseModel):
    quiz_id: str
    session_id: str
    score: Optional[int]
    is_finished: bool
    timestamp_started: datetime
    timestamp_finished: Optional[datetime]
    no_of_questions: int

class QuestionCreate(BaseModel):
    quiz_id: str
    quiz_question: str
    correct_answer: str

class QuestionResponse(BaseModel):
    question_id: str
    quiz_id: str
    quiz_question: str
    correct_answer: str

class UserAnswerCreate(BaseModel):
    question_id: str
    answer: str
    is_correct: bool

class UserAnswerResponse(BaseModel):
    user_answer_id: str
    question_id: str
    answer: str
    is_correct: bool
    created_at: datetime