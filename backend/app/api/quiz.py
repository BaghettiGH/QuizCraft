from fastapi import APIRouter
from app.services.supabase_client import get_supabase
from app.schemas.quiz import QuizCreate
from app.api.ai import generate_quiz_from_text
from pydantic import BaseModel

class NoteInput(BaseModel):
    text: str

from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    QuizCreate, QuizUpdate, QuestionCreate, UserAnswerCreate
)
from app.services.databases import db
from typing import List

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])

@router.post("")
async def create_quiz(quiz: QuizCreate):
    """Create a new quiz"""
    try:
        new_quiz = db.create_quiz(
            session_id=quiz.session_id,
            no_of_questions=quiz.no_of_questions
        )
        return {"quiz": new_quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    """Get a quiz by ID"""
    try:
        quiz = db.get_quiz(quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return {"quiz": quiz}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def list_quizzes(session_id: str = Query(..., description="Session ID")):
    """Get all quizzes for a session"""
    try:
        quizzes = db.get_session_quizzes(session_id)
        return {"quizzes": quizzes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{quiz_id}")
async def update_quiz(quiz_id: str, update: QuizUpdate):
    """Update quiz score and completion status"""
    try:
        updated = db.update_quiz(
            quiz_id=quiz_id,
            score=update.score,
            is_finished=update.is_finished
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return {"quiz": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-quiz")
def generate_quiz(input: NoteInput):
    quiz_data = generate_quiz_from_text(input.text)
    return {"quiz": quiz_data}

