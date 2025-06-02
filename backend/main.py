# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from rag_pipeline.rag_service import router as rag_router

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.auth import router as auth_router
from app.user import router as user_router
from app.chat import router as chat_router
# from app.template import router as template_router
# from auth.oauth import router as oauth_router
# from database import create_tables  ❌ DB 관련 제거

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://co-start.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 라우터 등록
# app.include_router(oauth_router, prefix="/auth")
app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/user")
app.include_router(chat_router, prefix="/chat")       # ❌ DB 필요하면 제외
# app.include_router(template_router, prefix="/template")
app.include_router(rag_router, prefix="/ask")

# ❌ DB 테이블 생성 제거
# @app.on_event("startup")
# async def startup_event():
#     create_tables()

@app.get("/")
def root():
    return {"message": "FastAPI backend for co.start is running"}

@app.get("/debug-db-url")
def debug_db_url():
    return {"DATABASE_URL": os.getenv("DATABASE_URL")}
