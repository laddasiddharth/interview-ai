from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.models import Question

def get_random_question(db: Session, topic: str):
    return db.query(Question).filter(Question.topic == topic).order_by(func.random()).first()  # pylint: disable=not-callable
