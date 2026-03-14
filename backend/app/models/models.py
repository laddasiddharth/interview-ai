from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base, engine
from app.utils.config import settings

# Conditional pgvector import for PostgreSQL support
try:
    from pgvector.sqlalchemy import Vector
    HAS_PGVECTOR_LIB = True
except ImportError:
    HAS_PGVECTOR_LIB = False

def check_vector_support():
    if "postgresql" not in settings.database_url.lower() or not HAS_PGVECTOR_LIB:
        return False
    
    try:
        # Try to enable the extension if it exists on the server
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
        return True
    except Exception:
        # Fallback if extension missing or permissions denied
        return False

USE_PGVECTOR = check_vector_support()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    interviews = relationship("InterviewSession", back_populates="user")

class InterviewSession(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    topic = Column(String)
    final_score = Column(Float, nullable=True)
    user = relationship("User", back_populates="interviews")
    answers = relationship("Answer", back_populates="interview")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String)
    content = Column(Text)
    difficulty = Column(String)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    question_text = Column(Text)
    answer_text = Column(Text)
    score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    interview = relationship("InterviewSession", back_populates="answers")

class AnswerCache(Base):
    __tablename__ = "answer_cache"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, index=True)
    answer_text = Column(Text)
    ai_feedback = Column(Text)
    score = Column(Integer)
    strengths = Column(Text)
    weakness = Column(Text)
    
    # pgvector column for semantic similarity search (PostgreSQL only)
    if USE_PGVECTOR:
        embedding = Column(Vector(384))  # all-MiniLM-L6-v2 has 384 dimensions
    else:
        embedding = Column(Text, nullable=True) # Fallback for SQLite (store as string or null)

