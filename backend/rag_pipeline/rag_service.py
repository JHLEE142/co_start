from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from rag_pipeline.retriever import get_relevant_documents
from rag_pipeline.gpt_chain import get_rag_chain
from bs4 import BeautifulSoup
import httpx
import os
import re
from dotenv import load_dotenv

# ✅ .env 불러오기 + 예외 처리
if not load_dotenv():
    print("⚠️ .env 파일을 찾을 수 없습니다.")
API_KEY = os.getenv("PUBLIC_API_KEY")
if not API_KEY:
    raise EnvironmentError("❌ PUBLIC_API_KEY 환경변수가 설정되어 있지 않습니다.")

# ✅ 환경변수 URL
NTS_BUSINESS_STATUS_API = os.getenv("NTS_BUSINESS_STATUS_API")
ACRC_CITIZEN_BIGDATA_API = os.getenv("ACRC_CITIZEN_BIGDATA_API")
MOIS_STATS_YEARBOOK_API = os.getenv("MOIS_STATS_YEARBOOK_API")

router = APIRouter()

# ✅ 입력 스키마 (사업자번호 선택적 입력)
class QuestionPayload(BaseModel):
    question: str
    business_number: Optional[str] = None

# ✅ 사업자번호 추출 함수 (숫자 10자리)
def extract_business_number(text: str) -> Optional[str]:
    match = re.search(r'\b\d{10}\b', text)
    return match.group() if match else None

# ✅ 국세청 사업자 상태조회 (POST)
async def fetch_business_status(b_no: str) -> str:
    headers = {"Content-Type": "application/json"}
    payload = {
        "serviceKey": API_KEY,
        "b_no": [b_no]
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(NTS_BUSINESS_STATUS_API, headers=headers, json=payload)
    if res.status_code == 200:
        try:
            result = res.json()["data"][0]
            return f"📌 사업자 상태: {result['b_stt']} ({result['tax_type']})"
        except:
            return "⚠️ 사업자 정보 파싱 실패"
    return f"❌ API 오류: {res.status_code}"

# ✅ 국민권익위 민원 빅데이터 요약
async def fetch_acrc_bigdata_summary() -> str:
    params = {
        "serviceKey": API_KEY,
        "pageNo": "1",
        "numOfRows": "3",
        "_type": "json"
    }
    async with httpx.AsyncClient() as client:
        res = await client.get(ACRC_CITIZEN_BIGDATA_API, params=params)
    if res.status_code == 200:
        try:
            items = res.json()["response"]["body"]["items"]["item"]
            summaries = [f"• {item['analsInfoNm']}" for item in items[:3]]
            return "📊 최근 민원 분석 정보:\n" + "\n".join(summaries)
        except:
            return "⚠️ 빅데이터 응답 파싱 실패"
    return f"❌ API 오류: {res.status_code}"

# ✅ 행정안전부 통계연보 민원 통계
async def fetch_government_service_stats() -> str:
    params = {
        "serviceKey": API_KEY,
        "pageNo": "1",
        "numOfRows": "1",
        "_type": "json"
    }
    async with httpx.AsyncClient() as client:
        res = await client.get(MOIS_STATS_YEARBOOK_API, params=params)
    if res.status_code == 200:
        try:
            item = res.json()["response"]["body"]["items"]["item"][0]
            return f"📈 [정부 민원 통계] 분류: {item.get('classNm', 'N/A')} / 민원 수: {item.get('civilCnt', 'N/A')}"
        except:
            return "⚠️ 통계 파싱 실패"
    return f"❌ API 오류: {res.status_code}"

# ✅ 노동부 FAQ 크롤링
async def fetch_moel_faq() -> str:
    async with httpx.AsyncClient() as client:
        res = await client.get("https://www.moel.go.kr/faq/faqList.do")
        soup = BeautifulSoup(res.text, "html.parser")
        faq = soup.select_one(".faq_list .title")
        return f"📌 [고용노동 FAQ] {faq.text.strip()}" if faq else "❌ FAQ 항목 없음"

# ✅ API context 생성 (질문 기반 자동 호출)
async def fetch_api_context(question: str, business_number: Optional[str] = None) -> str:
    context_parts = []

    if "세금" in question or "사업자" in question:
        b_no = business_number or extract_business_number(question) or "1234567890"
        context_parts.append(await fetch_business_status(b_no))

    if "민원" in question:
        context_parts.append(await fetch_acrc_bigdata_summary())

    if "행정" in question or "통계" in question:
        context_parts.append(await fetch_government_service_stats())

    if "노동" in question or "근로" in question:
        context_parts.append(await fetch_moel_faq())

    return "\n\n".join(context_parts)

# ✅ RAG 메인 라우터
@router.post("/")
async def handle_question(payload: QuestionPayload):
    question = payload.question
    business_number = payload.business_number

    # 1. 벡터 검색
    documents = get_relevant_documents(question)
    docs_context = "\n\n".join([doc.page_content for doc in documents])

    # 2. 실시간 API context 추가
    api_context = await fetch_api_context(question, business_number)

    # 3. 전체 context 구성
    full_context = docs_context + "\n\n" + api_context

    # 4. GPT 응답
    rag_chain = get_rag_chain()
    response = rag_chain.run({"question": question, "context": full_context})

    return {
        "question": question,
        "answer": response,
        "sources": [doc.metadata for doc in documents],
        "api_info_included": api_context
    }
