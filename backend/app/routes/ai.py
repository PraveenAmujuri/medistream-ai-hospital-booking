from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from app.core.config import GEMINI_API_KEY

router = APIRouter(prefix="/api", tags=["AI"])

client = genai.Client(api_key=GEMINI_API_KEY)


class AnalyzeRequest(BaseModel):
    symptoms: str


@router.post("/analyze")
async def analyze(data: AnalyzeRequest):
    try:
        prompt = f"""
        You are a medical triage assistant.

        Analyze the symptoms below and respond ONLY in valid JSON format.

        DO NOT include markdown.
        DO NOT include explanation outside JSON.

        Return strictly this structure:

        {{
        "suggestedDepartment": "string",
        "urgency": "Emergency | Priority | Normal",
        "reasoning": "short explanation"
        }}

        Symptoms:
        {data.symptoms}
        """


        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )


        return {
            "result": response.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
