from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import MessageCreate, MessageResponse
from app.services.databases import db
from typing import List

router = APIRouter(prefix="/api/messages", tags=["messages"])

@router.get("")
async def list_messages(session_id: str = Query(..., description="Session ID")):
    """Get all messages for a session"""
    try:
        messages = db.get_session_messages(session_id)
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict)
async def create_message(message: MessageCreate):
    """Create a new message"""
    try:
        new_message = db.create_message(
            session_id=message.session_id,
            sender=message.sender,
            content=message.content,
            quiz_data=message.quiz_data
        )
        return {"message": new_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))