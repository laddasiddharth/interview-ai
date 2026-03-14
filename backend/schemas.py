from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    messages: List[dict]
    question_context: Optional[dict] = None

class EvaluateRequest(BaseModel):
    code: str
    explanation: str
    question_context: dict

class QuestionBase(BaseModel):
    title: str
    difficulty: str
    link: str
    topics: str
    acceptance_rate: float
    category: str
    description: Optional[str] = None

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        from_attributes = True
