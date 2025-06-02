# ✅ backend/services/gpt_assistant.py
from services.assistant_client import run_assistant

def get_structured_advice(question: str, context: str) -> str:
    """
    OpenAI 기반 Assistant 호출을 통해 실행 중심의 상담 응답을 생성합니다.
    - 질문과 context를 기반으로 최종 응답을 생성합니다.
    """
    return run_assistant(question, context)
