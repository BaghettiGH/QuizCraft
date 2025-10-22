from fastapi import APIRouter, HTTPException
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
    Generate 5 multiple-choice questions (MCQs) based on the following text:
    {text}

    Format your response strictly as valid JSON like this:
    [
      {{
        "question": "Question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Option B"
      }},
      ...
    ]
    """
    try:
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

        json_match = re.search(r"\[.*\]", raw_output, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = raw_output 

        quiz_data = json.loads(json_str)
        return {"quiz": quiz_data}
            
        
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response as valid JSON. Raw output:\n{raw_output}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))