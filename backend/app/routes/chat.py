from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from google import genai
from google.genai import types
from app.utils.config import settings
from app.routes.auth import get_current_user
from sqlalchemy.orm import Session
from app.database.database import get_db

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    question_context: dict = None


@router.post("/")
async def chat_interview(
    request: ChatRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Chat endpoint for real-time interview conversation.
    Requires authentication and uses the new google-genai SDK.
    """
    client = genai.Client(api_key=settings.gemini_api_key)

    system_instruction = (
        "You are a technical interviewer at a top tech company. "
        "Evaluate the candidate's answers and guide them through the problem."
    )
    if request.question_context:
        system_instruction += (
            f" The candidate is currently solving: {request.question_context.get('title')}. "
            "Please keep responses concise and focused on the technical problem."
        )

    # Map history to new SDK format.
    history = []
    for msg in request.messages[:-1]:
        role = "user" if msg.role == "user" else "model"
        history.append(types.Content(role=role, parts=[types.Part.from_text(text=msg.content)]))

    chat = client.chats.create(
        model="gemini-1.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        ),
        history=history if history else None,
    )

    response = chat.send_message(request.messages[-1].content)

    return {"reply": response.text}
