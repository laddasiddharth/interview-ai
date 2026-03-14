from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    question_context: dict = None

@router.post("/")
async def chat_interview(request: ChatRequest):
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_instruction = "You are a technical interviewer at a top tech company. Evaluate the candidate's answers and guide them through the problem."
    if request.question_context:
        system_instruction += f" The candidate is currently solving: {request.question_context.get('title')}. Please keep responses concise and focused on the technical problem."
        
    history = []
    for msg in request.messages[:-1]:
        role = "user" if msg.role == "user" else "model"
        history.append({"role": role, "parts": msg.content})
        
    chat = model.start_chat(history=history)
    
    prompt = f"System: {system_instruction}\n\nCandidate: {request.messages[-1].content}"
    response = chat.send_message(prompt)
    
    return {"reply": response.text}
