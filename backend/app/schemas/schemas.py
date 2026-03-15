from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


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
    model_config = ConfigDict(from_attributes=True)


class QuestionResponse(BaseModel):
    id: int
    topic: str
    content: str
    difficulty: str


class AnswerSubmit(BaseModel):
    interview_id: int
    question_text: str
    answer_text: str
    language: Optional[str] = None


class EvaluationResponse(BaseModel):
    score: int
    feedback: str
    follow_up_question: Optional[str] = None
