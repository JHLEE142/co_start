from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# 요청 형식 정의
class ChatRequest(BaseModel):
    prompt: str

# 응답 형식 정의
class ChatResponse(BaseModel):
    answer: str

# 인증 없는 채팅 처리 엔드포인트
@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    prompt = request.prompt
    # 임시 테스트 응답
    return ChatResponse(answer=f"🧠 AI Response to: {prompt}")
