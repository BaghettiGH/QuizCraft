from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import re
import asyncio

load_dotenv()

router = APIRouter()

# Get environment
ENV = os.getenv("ENV", "development")

# Initialize clients
openai_client = None
if ENV == "production":
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
else:
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if google_api_key:
        genai.configure(api_key=google_api_key)

class Message(BaseModel):
    role: str
    content: str

class ExplainRequest(BaseModel):
    messages: List[Message]

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str

def detect_quiz_intent(user_message: str) -> bool:
    """Detect if user wants to be quizzed"""
    quiz_keywords = [
        "quiz me", "test me", "practice problems", "practice questions",
        "make a quiz", "generate quiz", "create quiz", "questions about",
        "test my knowledge", "check my understanding", "make questions"
    ]
    return any(keyword in user_message.lower() for keyword in quiz_keywords)

def extract_quiz_topic(user_message: str) -> str:
    """Extract the topic from quiz request"""
    # Remove common quiz trigger phrases to get the topic
    message = user_message.lower()
    triggers = ["quiz me about", "quiz me on", "test me on", "practice problems about", 
                "practice questions on", "make a quiz about", "questions about"]
    
    for trigger in triggers:
        if trigger in message:
            topic = message.split(trigger)[-1].strip()
            return topic
    
    # If no specific trigger found, return the whole message
    return user_message

def generate_quiz(topic: str, context_messages: List[Message]) -> List[QuizQuestion]:
    """Generate quiz questions based on topic and conversation context"""
    
    # Build context from previous messages
    context = "\n".join([f"{msg.role}: {msg.content}" for msg in context_messages[-5:]])
    
    prompt = f"""Based on the conversation context and the topic "{topic}", generate 5 multiple-choice questions.

Context:
{context}

Generate questions that test understanding of {topic}. Format your response ONLY as valid JSON (no markdown, no extra text):
[
  {{
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B"
  }}
]
Make sure all 4 options are plausible but only one is correct."""

    try:
        if ENV == "production":
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

        # Extract JSON from response
        json_match = re.search(r"\[.*\]", raw_output, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = raw_output

        quiz_data = json.loads(json_str)
        return [QuizQuestion(**q) for q in quiz_data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.post("/explain")
async def explain_mode(request: ExplainRequest):
    system_prompt = "You are a friendly tutor who explains things clearly for students. Break down complex concepts into simple terms, use examples, and encourage learning."
    
    try:
        # Get the last user message
        last_message = request.messages[-1].content
        
        # Check if user wants a quiz
        if detect_quiz_intent(last_message):
            topic = extract_quiz_topic(last_message)
            quiz_questions = generate_quiz(topic, request.messages[:-1])
            
            return {
                "answer": f"Great! Let's test your knowledge about {topic}. I've prepared a quiz for you.",
                "quiz": [q.dict() for q in quiz_questions],
                "quiz_topic": topic
            }
        
        # Regular explanation mode
        if ENV == "production":
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *[{"role": msg.role, "content": msg.content} for msg in request.messages]
                ],
                temperature=0.7,
            )
            answer = response.choices[0].message.content
        else:
            model = genai.GenerativeModel(
                "gemini-2.5-flash",
                system_instruction=system_prompt
            )
            
            chat = model.start_chat(history=[])
            
            for i, msg in enumerate(request.messages[:-1]):
                if msg.role == "user":
                    chat.send_message(msg.content)

            try:
                response = await asyncio.wait_for(
                    asyncio.to_thread(chat.send_message, request.messages[-1].content),
                    timeout=60
                )
                answer = response.text
            except asyncio.TimeoutError:
                raise HTTPException(status_code=504, detail="Gemini took too long to respond")
            
            response = chat.send_message(request.messages[-1].content)
            answer = response.text
        
        return {"answer": answer}
        
    except Exception as e:
        print("❌ Backend Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")