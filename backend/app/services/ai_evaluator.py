from google import genai
from app.utils.config import settings
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from app.models.models import AnswerCache

class AIEvaluator:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')

    def check_cache(self, db: Session, question: str, answer: str):
        # Find cached answers for the exact same question
        cached_answers = db.query(AnswerCache).filter(AnswerCache.question_text == question).all()
        if not cached_answers:
            return None
        
        # Encode current answer
        current_emb = self.encoder.encode([answer])
        
        # Evaluate similarity against cached answers
        best_match = None
        highest_similarity = 0.0
        
        for cache in cached_answers:
            cache_emb = self.encoder.encode([cache.answer_text])
            sim = cosine_similarity(current_emb, cache_emb)[0][0]
            if sim > highest_similarity:
                highest_similarity = sim
                best_match = cache
                
        if highest_similarity > 0.9 and best_match:
            return {
                "score": best_match.score,
                "feedback": best_match.ai_feedback,
                "strengths": best_match.strengths,
                "weakness": best_match.weakness,
                "cached": True
            }
        return None

    def evaluate_answer(self, question: str, answer: str, db: Session = None) -> dict:
        if db:
            cached_result = self.check_cache(db, question, answer)
            if cached_result:
                cached_result["follow_up_question"] = None  # Could optionally generate one
                return cached_result

        prompt = f"""
You are an expert technical interviewer evaluating a candidate's response.
Question: {question}
Candidate Answer: {answer}

Provide your feedback as a short JSON object with exactly these fields:
1. "score": An integer from 1 to 10.
2. "feedback": General constructive feedback (1 line).
3. "strengths": The candidate's strengths (1 line).
4. "weakness": The candidate's weakness (1 line).
5. "follow_up_question": A short, relevant follow-up question (1 line).

Return ONLY valid JSON.
"""
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        try:
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:-3]
            elif text.startswith('```'):
                text = text[3:-3]
            res = json.loads(text)
            
            # Save to cache if DB provided
            if db:
                new_cache = AnswerCache(
                    question_text=question,
                    answer_text=answer,
                    ai_feedback=res.get("feedback", ""),
                    score=res.get("score", 5),
                    strengths=res.get("strengths", ""),
                    weakness=res.get("weakness", "")
                )
                db.add(new_cache)
                db.commit()
            return res
        except Exception as e:
            return {"score": 5, "feedback": f"Error parsing AI response: {str(e)}", "follow_up_question": None}

    def generate_final_report(self, interview_answers: list[dict]) -> dict:
        answers_text = ""
        for idx, item in enumerate(interview_answers):
            answers_text += f"\nQ{idx+1}: {item['question']}\nA{idx+1}: {item['answer']}\n"
            
        prompt = f"""
You are an expert technical interviewer. Review the following questions and answers from an interview session:
{answers_text}

Provide a final evaluation report as a strict JSON object with these fields:
1. "total_score": An overall score from 1 to 10 for the entire session.
2. "overall_strengths": A summary of the candidate's core strengths across all answers.
3. "overall_weakness": A summary of the candidate's core weaknesses or areas for improvement.
4. "final_summary": A brief 2-3 sentence final summary.

Return ONLY valid JSON.
"""
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        try:
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:-3]
            elif text.startswith('```'):
                text = text[3:-3]
            return json.loads(text)
        except Exception as e:
            return {"error": f"Error generating report: {str(e)}", "total_score": 0}

evaluator = AIEvaluator()
