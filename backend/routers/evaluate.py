from fastapi import APIRouter, Depends
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.utils.config import settings
from app.routes.auth import get_current_user
from sqlalchemy.orm import Session
from app.database.database import get_db
import json

router = APIRouter(prefix="/evaluate", tags=["evaluate"])

class EvaluateRequest(BaseModel):
    code: str
    explanation: str
    question_context: dict

@router.post("/")
async def evaluate_code(
    request: EvaluateRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluate code submission using the new google-genai SDK.
    Requires authentication to prevent unauthorized API usage.
    """
    client = genai.Client(api_key=settings.gemini_api_key)
    
    prompt = f"""
    Evaluate the following code and explanation for solving the problem "{request.question_context.get('title', 'Unknown')}".
    Code:
    {request.code}
    
    Explanation:
    {request.explanation}
    
    Provide your evaluation in JSON format with the following keys:
    - "correctness": Integer score 0-100
    - "time_complexity": String (e.g., O(N))
    - "space_complexity": String (e.g., O(1))
    - "feedback": Detailed text feedback on the solution
    - "improvements": List of strings detailing ways to improve
    """
    
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    try:
        result = json.loads(response.text)
        return result
    except Exception as e:
        return {"error": f"Failed to parse evaluation response: {str(e)}"}
