from supabase import create_client, Client
from typing import List, Optional
import os
from app.core.config import settings

class DatabaseService:
    def __init__(self):
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_KEY
        self.client: Client = create_client(url, key)
    
    # ===== SESSION METHODS =====
    def get_user_sessions(self, user_id: int) -> List[dict]:
        """Get all sessions for a user, ordered by last_active_at desc"""
        response = self.client.table("Chat_Session") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("last_active_at", desc=True) \
            .execute()
        return response.data
    
    def create_session(self, user_id: int, title: str, mode: str) -> dict:
        """Create a new chat session"""
        data = {
            "user_id": user_id,
            "title": title,
            "mode": mode,
            "last_active_at": "now()"
        }
        response = self.client.table("Chat_Session") \
            .insert(data) \
            .execute()
        return response.data[0]
    
    def update_session(self, session_id: str, title: Optional[str] = None) -> dict:
        """Update session title and last_active_at"""
        data = {"last_active_at": "now()"}
        if title:
            data["title"] = title
        
        response = self.client.table("Chat_Session") \
            .update(data) \
            .eq("session_id", session_id) \
            .execute()
        return response.data[0] if response.data else None
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session (cascade deletes messages)"""
        response = self.client.table("Chat_Session") \
            .delete() \
            .eq("session_id", session_id) \
            .execute()
        return len(response.data) > 0
    
    # ===== MESSAGE METHODS =====
    def get_session_messages(self, session_id: str) -> List[dict]:
        """Get all messages for a session, ordered by timestamp"""
        response = self.client.table("Message") \
            .select("*") \
            .eq("session_id", session_id) \
            .order("timestamp", desc=False) \
            .execute()
        return response.data
    
    def create_message(self, session_id: str, sender: str, content: str, 
                      quiz_data: Optional[str] = None) -> dict:
        """Create a new message"""
        data = {
            "session_id": session_id,
            "sender": sender,
            "content": content,
            "quiz_data": quiz_data
        }
        response = self.client.table("Message") \
            .insert(data) \
            .execute()
        
        # Update session's last_active_at
        self.update_session(session_id)
        
        return response.data[0]
    
    # ===== QUIZ METHODS =====
    def create_quiz(self, session_id: str, no_of_questions: int) -> dict:
        """Create a new quiz"""
        data = {
            "session_id": session_id,
            "score": None,
            "is_finished": False,
            "no_of_questions": no_of_questions
        }
        response = self.client.table("Quiz") \
            .insert(data) \
            .execute()
        return response.data[0]
    
    def get_quiz(self, quiz_id: str) -> Optional[dict]:
        """Get a quiz by ID"""
        response = self.client.table("Quiz") \
            .select("*") \
            .eq("quiz_id", quiz_id) \
            .execute()
        return response.data[0] if response.data else None
    
    def get_session_quizzes(self, session_id: str) -> List[dict]:
        """Get all quizzes for a session"""
        response = self.client.table("Quiz") \
            .select("*") \
            .eq("session_id", session_id) \
            .order("timestamp_started", desc=True) \
            .execute()
        return response.data
    
    def update_quiz(self, quiz_id: str, score: Optional[int] = None, 
                   is_finished: Optional[bool] = None) -> dict:
        """Update quiz score and status"""
        data = {}
        if score is not None:
            data["score"] = score
        if is_finished is not None:
            data["is_finished"] = is_finished
            if is_finished:
                data["timestamp_finished"] = "now()"
        
        response = self.client.table("Quiz") \
            .update(data) \
            .eq("quiz_id", quiz_id) \
            .execute()
        return response.data[0] if response.data else None
    
    # ===== QUESTION METHODS =====
    def create_question(self, quiz_id: str, quiz_question: str, 
                       correct_answer: str) -> dict:
        """Create a new question"""
        data = {
            "quiz_id": quiz_id,
            "quiz_question": quiz_question,
            "correct_answer": correct_answer
        }
        response = self.client.table("Question") \
            .insert(data) \
            .execute()
        return response.data[0]
    
    def create_questions_batch(self, questions: List[dict]) -> List[dict]:
        """Create multiple questions at once"""
        response = self.client.table("Question") \
            .insert(questions) \
            .execute()
        return response.data
    
    def get_quiz_questions(self, quiz_id: str) -> List[dict]:
        """Get all questions for a quiz"""
        response = self.client.table("Question") \
            .select("*") \
            .eq("quiz_id", quiz_id) \
            .execute()
        return response.data
    
    # ===== USER ANSWER METHODS =====
    def create_user_answer(self, question_id: str, answer: str, 
                          is_correct: bool) -> dict:
        """Create a user answer"""
        data = {
            "question_id": question_id,
            "answer": answer,
            "is_correct": is_correct
        }
        response = self.client.table("User_Answer") \
            .insert(data) \
            .execute()
        return response.data[0]
    
    def get_question_answer(self, question_id: str) -> Optional[dict]:
        """Get user's answer for a question"""
        response = self.client.table("User_Answer") \
            .select("*") \
            .eq("question_id", question_id) \
            .execute()
        return response.data[0] if response.data else None
    
    def get_quiz_answers(self, quiz_id: str) -> List[dict]:
        """Get all user answers for a quiz"""
        response = self.client.table("User_Answer") \
            .select("*, Question!inner(quiz_id)") \
            .eq("Question.quiz_id", quiz_id) \
            .execute()
        return response.data

# Singleton instance
db = DatabaseService()