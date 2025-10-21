from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv

router = APIRouter()
client = OpenAI()

class Message(BaseModel):
    role: str
    content: str

class ExplainRequest(BaseModel):
    messages: List[Message]

@router.post("/explain")
async def explain_mode(request: ExplainRequest):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a friendly tutor who explains things clearly for students."},
            *[{"role": msg.role, "content": msg.content} for msg in request.messages]
        ]
    )
    answer = response.choices[0].message["content"]
    return {"answer": answer}
