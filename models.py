from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from database import Base
from passlib.context import CryptContext

# 비밀번호 해싱 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # ✅ 평문이 아닌 해싱된 비밀번호 저장
    plan = Column(String, default="free")
    name = Column(String, nullable=False)

    # ✅ 비밀번호 해싱 메서드 추가
    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)

    # ✅ 비밀번호 확인 메서드 추가
    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)  # ✅ 자동 증가 설정
    payment_id = Column(String, unique=True, nullable=False)
    payer_id = Column(String, nullable=False)
    status = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)