from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    difficulty = Column(String, index=True)
    link = Column(String)
    topics = Column(String)
    acceptance_rate = Column(Float)
    category = Column(String, index=True)
    description = Column(Text, nullable=True)
