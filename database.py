from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = "postgresql://x_project_user:your_password@localhost/x_project_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ 데이터베이스 세션을 가져오는 종속성 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()