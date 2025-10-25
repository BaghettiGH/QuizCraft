from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import UserAnswerCreate
from app.services.databases import db

router = APIRouter(prefix="/api/answers", tags=["answers"])

@router.post("")
async def create_answer(answer: UserAnswerCreate):
    """Create a user answer"""
    try:
        new_answer = db.create_user_answer(
            question_id=answer.question_id,
            answer=answer.answer,
            is_correct=answer.is_correct
        )
        return {"answer": new_answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/question/{question_id}")
async def get_answer(question_id: str):
    """Get user's answer for a specific question"""
    try:
        answer = db.get_question_answer(question_id)
        if not answer:
            raise HTTPException(status_code=404, detail="Answer not found")
        return {"answer": answer}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quiz/{quiz_id}")
async def get_quiz_answers(quiz_id: str):
    """Get all user answers for a quiz"""
    try:
        answers = db.get_quiz_answers(quiz_id)
        return {"answers": answers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))