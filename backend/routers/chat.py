from fastapi import APIRouter, Request
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# 테스트용 고정 사용자 ID
TEST_USER_ID = 1

# 임시 메모리 저장소
mock_chat_storage = []

class ChatSavePayload(BaseModel):
    prompt: str
    response: str
    title: str = "Untitled"

@router.post("/chat/save")
def save_chat(payload: ChatSavePayload):
    estimated_token_usage = len(payload.response.split())

    chat = {
        "id": len(mock_chat_storage) + 1,
        "user_id": TEST_USER_ID,
        "prompt": payload.prompt,
        "response": payload.response,
        "title": payload.title,
        "token_usage": estimated_token_usage,
        "created_at": datetime.utcnow().isoformat()
    }

    mock_chat_storage.append(chat)

    return {
        "message": "Chat saved (mocked)",
        "tokens_used": estimated_token_usage
    }

@router.get("/user")
def get_user_chats():
    return [
        {
            "id": chat["id"],
            "title": chat["title"],
            "created_at": chat["created_at"],
            "tokens": chat["token_usage"]
        }
        for chat in mock_chat_storage if chat["user_id"] == TEST_USER_ID
    ]
