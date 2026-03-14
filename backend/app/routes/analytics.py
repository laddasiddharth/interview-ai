from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import InterviewSession
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/user")
def get_user_analytics(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).all()
    # Basic analytics: total interviews, topics, average scores
    total = len(interviews)
    return {"total_interviews": total}
