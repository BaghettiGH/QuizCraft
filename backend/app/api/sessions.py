from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import SessionCreate, SessionUpdate, SessionResponse
from app.services.databases import db
from typing import List

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.get("")
async def list_sessions(user_id: str = Query(..., description="User UUID")):
    """Get all sessions for a user"""
    try:
        sessions = db.get_user_sessions(user_id)
        return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict)
async def create_session(session: SessionCreate):
    """Create a new chat session"""
    try:
        new_session = db.create_session(
            user_id=session.user_id,
            title=session.title,
            mode=session.mode
        )
        return {"session": new_session}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{session_id}")
async def update_session(session_id: str, update: SessionUpdate):
    """Update session title"""
    try:
        updated = db.update_session(session_id, title=update.title)
        if not updated:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"session": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and all its messages"""
    try:
        success = db.delete_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"message": "Session deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))