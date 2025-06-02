from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from auth.jwt_utils import create_jwt_token
from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")

class LoginInput(BaseModel):
    email: str
    password: str

class SignupInput(BaseModel):
    email: str
    password: str
    nickname: str

router = APIRouter()

# ✅ 더미 유저 (DB 없이 사용)
dummy_user = {
    "id": 1,
    "email": "test@test.com",
    "name": "테스트유저",
    "plan": "Pro",
    "credit_usage": 100000
}

@router.post("/signup")
def signup(data: SignupInput):
    # 실제 DB 저장 없이 성공 응답만
    return {"message": "User created (dummy)"}

@router.post("/login")
def login(data: LoginInput):
    # 이메일/비번 무조건 성공으로 간주
    token = create_jwt_token({
        "id": dummy_user["id"],
        "email": dummy_user["email"],
        "name": dummy_user["name"],
        "plan": dummy_user["plan"],
        "credit_usage": dummy_user["credit_usage"]
    })

    return {
        "token": token,
        "user": dummy_user
    }

@router.get("/me")
def get_me():
    return {
        "id": 1,
        "email": "test@test.com",
        "nickname": "테스트유저",
        "plan": "Pro",
        "credit_usage": 1000000
    }
