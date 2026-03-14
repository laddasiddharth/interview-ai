from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import InterviewSession, Answer
from app.schemas.schemas import InterviewStart, InterviewResponse, AnswerSubmit, EvaluationResponse
from app.services.ai_evaluator import evaluator
from app.services.question_service import get_random_question
from app.routes.auth import get_current_user

router = APIRouter()

@router.post("/start", response_model=InterviewResponse)
def start_interview(data: InterviewStart, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    new_interview = InterviewSession(user_id=current_user.id, topic=data.topic)
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    return new_interview

@router.get("/question")
def get_question(topic: str, db: Session = Depends(get_db)):
    question = get_random_question(db, topic)
    if not question:
        raise HTTPException(status_code=404, detail="No questions found for topic")
    return {"question": question.content, "difficulty": question.difficulty}

@router.post("/answer", response_model=EvaluationResponse)
def submit_answer(data: AnswerSubmit, db: Session = Depends(get_db)):
    evaluation = evaluator.evaluate_answer(data.question_text, data.answer_text)
    
    answer_record = Answer(
        interview_id=data.interview_id,
        question_text=data.question_text,
        answer_text=data.answer_text,
        score=evaluation.get("score"),
        feedback=evaluation.get("feedback")
    )
    db.add(answer_record)
    db.commit()
    
    return EvaluationResponse(
        score=evaluation.get("score"),
        feedback=evaluation.get("feedback"),
        follow_up_question=evaluation.get("follow_up_question")
    )

@router.get("/report/{interview_id}")
def get_report(interview_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    interview = db.query(InterviewSession).filter(InterviewSession.id == interview_id, InterviewSession.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"topic": interview.topic, "start_time": interview.start_time, "answers": interview.answers}
