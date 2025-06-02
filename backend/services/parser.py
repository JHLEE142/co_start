# ✅ backend/services/parser.py
from typing import Dict
import re
from datetime import datetime
from openai import OpenAI
import os

# 기본: OpenAI로 추출 (or 대체 모델 사용 가능)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_lease_data(user_input: str) -> Dict:
    prompt = f"""
사용자 요청: "{user_input}"

아래 양식에 맞춰 필요한 정보를 JSON 형식으로 추출하세요.
누락된 항목은 null로 채우고, 날짜는 yyyy-mm-dd 형식으로 변환하세요.

형식:
{{
  "임대인": "...",
  "임차인": "...",
  "계약일자": "...",
  "보증금": "...",
  "월세": "...",
  "주소": "..."
}}
    """

    response = client.chat.completions.create(
        model="gpt-4o",  # 또는 "gpt-3.5-turbo"
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    try:
        content = response.choices[0].message.content.strip()
        data = eval(content)  # 또는 json.loads(content) → 보안 강화를 위해 수정 가능
        return data
    except Exception as e:
        print(f"❌ 데이터 파싱 실패: {e}")
        return {}
