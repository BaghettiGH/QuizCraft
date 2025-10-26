from fastapi import APIRouter, HTTPException
from app.models.schemas import LoginRequest, SignupRequest, AuthResponse
from app.services.databases import db
import os

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login")
async def login(credentials: LoginRequest):
    """Login user with email and password"""
    try:
        # Authenticate with Supabase Auth
        response = db.client.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        # Get user profile from User table
        user_profile = db.get_user_by_email(credentials.email)
        
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": user_profile["user_id"] if user_profile else None,
                "auth_id": response.user.id,
                "email": response.user.email,
                "first_name": user_profile.get("first_name") if user_profile else None,
                "last_name": user_profile.get("last_name") if user_profile else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

@router.post("/signup")
async def signup(credentials: SignupRequest):
    """Sign up new user"""
    try:
        # Create auth user in Supabase Auth
        auth_response = db.client.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password
        })
        
        # Create user profile in User table
        user_profile = db.create_user_profile(
            user_id=auth_response.user.id,
            email=credentials.email,
            first_name=credentials.first_name,
            last_name=credentials.last_name
        )
        
        return {
            "access_token": auth_response.session.access_token if auth_response.session else None,
            "token_type": "bearer",
            "user": {
                "id": user_profile["user_id"],
                "auth_id": auth_response.user.id,
                "email": credentials.email,
                "first_name": credentials.first_name,
                "last_name": credentials.last_name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup failed: {str(e)}")

@router.post("/logout")
async def logout():
    """Logout user"""
    try:
        db.client.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user():
    """Get current authenticated user"""
    try:
        user = db.client.auth.get_user()
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        user_profile = db.get_user_by_email(user.email)
        
        return {
            "user": {
                "id": user_profile["user_id"] if user_profile else None,
                "auth_id": user.id,
                "email": user.email,
                "first_name": user_profile.get("first_name") if user_profile else None,
                "last_name": user_profile.get("last_name") if user_profile else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))