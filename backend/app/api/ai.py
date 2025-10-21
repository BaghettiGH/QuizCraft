from fastapi import APIRouter
from pydantic import BaseModel
import os
import re
import json
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv
from app.core.config import settings

load_dotenv()
router = APIRouter()
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

def generate_quiz_from_text(text: str):
    prompt = f"""
    Generate 10 quiz questions and their correct answers from the following text.
    Format them as a valid JSON array with objects containing 'question' and 'answer' keys.

    Text:
    {text}
    """
    if settings.ENV == "production":
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        raw_output = response.choices[0].message.content.strip()
    else:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        raw_output = response.text.strip()

    cleaned = re.sub(r"^```json|```$", "", raw_output, flags=re.MULTILINE).strip()
        
    try:
        quiz_data = json.loads(cleaned)
    except json.JSONDecodeError:
        quiz_data = [{"question": "Failed to parse quiz output", "answer": raw_output}]

        return {"quiz": quiz_data}
    