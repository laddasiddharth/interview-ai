from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(prefix="/evaluate", tags=["evaluate"])

class EvaluateRequest(BaseModel):
    code: str
    explanation: str
    question_context: dict

@router.post("/")
async def evaluate_code(request: EvaluateRequest):
    model = genai.GenerativeModel(
        'gemini-1.5-flash',
        generation_config={"response_mime_type": "application/json"}
    )
    
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
    
    response = model.generate_content(prompt)
    
    try:
        result = json.loads(response.text)
        return result
    except:
        return {"error": "Failed to parse evaluation response."}
