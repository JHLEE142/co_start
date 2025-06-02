# backend/app/chat.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/user")
def get_user_chats():
    return [
        {"id": 1, "title": "Mock Chat 1"},
        {"id": 2, "title": "Mock Chat 2"},
    ]
