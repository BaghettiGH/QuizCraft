from fastapi import APIRouter
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv
from app.core.config import settings

load_dotenv()
router = APIRouter()
client = OpenAI(api_key=settings.openai_api_key)

class NoteInput(BaseModel):
    text: str
@router.post("/generate-quiz")
def generate_quiz(input: NoteInput):
    prompt = f"""
    Generate 10 quiz questions and their correct answers from the following text.
    Format them as JSON with fields 'question' and 'answer'.

    Text:
    {input.text}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        temperature=0.7,
    )

    return {"quiz": response.choices[0].message.content}