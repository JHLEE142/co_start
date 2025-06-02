# backend/app/user.py

from fastapi import APIRouter, Request, HTTPException
from jose import jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")

@router.get("/me")
def get_user_info(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = token.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    # ✅ DB 없이 payload 정보만 기반으로 사용자 정보 생성
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "plan": payload.get("plan"),
        "credit_usage": payload.get("credit_usage"),
        "total_tokens_used": 0,
        "requests_processed": 0,
        "weekly_stat": 0.0,
        "created_at": "2025-01-01T00:00:00",
        "last_active": "2025-01-01T00:00:00",
        "provider": "local"
    }
