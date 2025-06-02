# ✅ services/assistant_client.py
import openai
import os
import json

openai.api_key = os.getenv("OPENAI_API_KEY")
ASSISTANT_CONFIG = "services/assistant_config.json"

def ensure_assistant_created() -> str:
    if os.path.exists(ASSISTANT_CONFIG):
        with open(ASSISTANT_CONFIG, "r") as f:
            return json.load(f)["assistant_id"]

    # Assistant 최초 등록
    assistant = openai.beta.assistants.create(
        name="Startup Legal Assistant",
        instructions=(
            "당신은 스타트업 CEO를 위한 전문 법률·세무·노동 AI 도우미입니다.\n\n"
            "📌 다음 조건을 반드시 지켜 응답하세요:\n"
            "1. 전체 답변은 Markdown 형식으로 작성합니다.\n"
            "2. 각 문단마다 📌 소제목과 줄바꿈을 붙입니다.\n"
            "3. 날짜 질문에는 실제 계산된 기한을 포함합니다.\n"
            "4. 관련 법령은 법명과 조문 번호까지 명시합니다.\n"
            "5. 마지막 문단은 💡 대표님께 드리는 추가 조언으로 마무리하세요.\n"
            "6. 가능하면 링크도 Markdown 형식으로 포함하세요."
        ),
        model="gpt-4o"
    )

    with open(ASSISTANT_CONFIG, "w") as f:
        json.dump({"assistant_id": assistant.id}, f)

    return assistant.id

def run_assistant(question: str, context: str) -> str:
    assistant_id = ensure_assistant_created()
    thread = openai.beta.threads.create()

    # 사용자 질문 등록
    openai.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=f"[사용자 질문]\n{question}\n\n[참고 문서 및 API 응답 정보]\n{context}"
    )

    # 실행 요청
    run = openai.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    # 상태 확인 및 응답 대기
    while True:
        result = openai.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        if result.status == "completed":
            break

    # 응답 반환
    messages = openai.beta.threads.messages.list(thread_id=thread.id)
    return messages.data[0].content[0].text.value
