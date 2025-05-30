from models import Base
from database import engine

print("⚠️ 데이터베이스 초기화 중...")

# ✅ 기존 테이블 삭제
Base.metadata.drop_all(bind=engine)
print("✅ 기존 테이블 삭제 완료")

# ✅ 테이블 새로 생성
Base.metadata.create_all(bind=engine)
print("✅ 새 테이블 생성 완료")

print("🚀 데이터베이스 초기화 완료!")
