from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.models import InterviewSession, Answer
from app.routes.auth import get_current_user
from typing import List, Dict

router = APIRouter()

@router.get("/user")
def get_user_analytics(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get comprehensive analytics for the current user including:
    - Total interviews
    - Average score
    - Best score
    - Performance timeline data
    """
    # Get all interviews for current user
    interviews = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).all()
    
    total_interviews = len(interviews)
    
    # Get all answers and calculate scores
    answers = db.query(Answer).join(
        InterviewSession,
        Answer.interview_id == InterviewSession.id
    ).filter(
        InterviewSession.user_id == current_user.id,
        Answer.score.isnot(None)
    ).all()
    
    if not answers:
        return {
            "total_interviews": total_interviews,
            "average_score": 0,
            "best_score": 0,
            "performance_data": [],
            "topics": {}
        }
    
    # Calculate average and best scores
    scores = [answer.score for answer in answers if answer.score is not None]
    average_score = sum(scores) / len(scores) if scores else 0
    best_score = max(scores) if scores else 0
    
    # Build performance timeline data (grouped by interview)
    performance_data = []
    interview_scores = {}
    
    for answer in answers:
        interview_id = answer.interview_id
        if interview_id not in interview_scores:
            interview = db.query(InterviewSession).filter(
                InterviewSession.id == interview_id
            ).first()
            if interview:
                interview_scores[interview_id] = {
                    "interview_id": interview_id,
                    "date": interview.start_time.isoformat(),
                    "scores": []
                }
        
        if interview_id in interview_scores:
            interview_scores[interview_id]["scores"].append(answer.score)
    
    # Calculate average score per interview
    for interview_id, data in interview_scores.items():
        avg = sum(data["scores"]) / len(data["scores"]) if data["scores"] else 0
        performance_data.append({
            "date": data["date"],
            "score": round(avg, 2)
        })
    
    # Sort by date
    performance_data = sorted(performance_data, key=lambda x: x["date"])
    
    # Calculate topics distribution
    topics_dict = {}
    for interview in interviews:
        topic = interview.topic
        if topic:
            topics_dict[topic] = topics_dict.get(topic, 0) + 1
    
    return {
        "total_interviews": total_interviews,
        "average_score": round(average_score, 2),
        "best_score": best_score,
        "performance_data": performance_data,
        "topics": topics_dict
    }

@router.get("/user/details")
def get_user_interview_details(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
    topic: str = None
):
    """
    Get detailed analytics per topic.
    """
    query = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    )
    
    if topic:
        query = query.filter(InterviewSession.topic == topic)
    
    interviews = query.all()
    
    details = []
    for interview in interviews:
        answers = db.query(Answer).filter(
            Answer.interview_id == interview.id
        ).all()
        
        scores = [a.score for a in answers if a.score is not None]
        interview_avg = sum(scores) / len(scores) if scores else 0
        
        details.append({
            "interview_id": interview.id,
            "topic": interview.topic,
            "start_time": interview.start_time.isoformat(),
            "end_time": interview.end_time.isoformat() if interview.end_time else None,
            "total_questions": len(answers),
            "average_score": round(interview_avg, 2),
            "answers": [
                {
                    "question": a.question_text,
                    "score": a.score,
                    "feedback": a.feedback
                }
                for a in answers
            ]
        })
    
    return details
