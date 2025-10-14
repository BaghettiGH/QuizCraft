from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import openai

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ExplainRequest(BaseModel):
    messages: List[Message]

@router.post("/explain")
async def explain_mode(request: ExplainRequest):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a friendly tutor who explains things clearly for students."},
            *[{"role": msg.role, "content": msg.content} for msg in request.messages]
        ]
    )
    answer = response.choices[0].message["content"]
    return {"answer": answer}
