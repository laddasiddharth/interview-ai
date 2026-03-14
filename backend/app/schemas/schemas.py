from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class InterviewStart(BaseModel):
    topic: str

class InterviewResponse(BaseModel):
    id: int
    topic: str
    start_time: datetime
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    topic: str
    content: str
    difficulty: str

class AnswerSubmit(BaseModel):
    interview_id: int
    question_text: str
    answer_text: str

class EvaluationResponse(BaseModel):
    score: int
    feedback: str
    follow_up_question: Optional[str] = None
