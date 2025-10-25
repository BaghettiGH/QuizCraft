from fastapi import APIRouter, HTTPException, Query, Body
from app.models.schemas import QuestionCreate
from app.services.databases import db
from typing import List

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.post("")
async def create_question(question: QuestionCreate):
    """Create a single question"""
    try:
        new_question = db.create_question(
            quiz_id=question.quiz_id,
            quiz_question=question.quiz_question,
            correct_answer=question.correct_answer
        )
        return {"question": new_question}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch")
async def create_questions_batch(questions: List[QuestionCreate]):
    """Create multiple questions at once"""
    try:
        questions_data = [
            {
                "quiz_id": q.quiz_id,
                "quiz_question": q.quiz_question,
                "correct_answer": q.correct_answer
            }
            for q in questions
        ]
        new_questions = db.create_questions_batch(questions_data)
        return {"questions": new_questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def list_questions(quiz_id: str = Query(..., description="Quiz ID")):
    """Get all questions for a quiz"""
    try:
        questions = db.get_quiz_questions(quiz_id)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))