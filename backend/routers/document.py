# ✅ backend/routers/document.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import FileResponse
from services.document_filler import fill_lease_contract_from_prompt

router = APIRouter()

class UserInput(BaseModel):
    prompt: str

@router.post("/generate/lease-agreement")
def generate_from_prompt(user_input: UserInput):
    try:
        file_path = fill_lease_contract_from_prompt(user_input.prompt)
        return FileResponse(file_path, filename=file_path.split("/")[-1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"문서 제작 실패: {e}")
