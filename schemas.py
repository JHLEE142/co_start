from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    plan: str = "free"

class UserCreate(BaseModel):
    name: str
    email: str
    password: str  # ✅ 비밀번호 입력 필드 (해싱되지 않은 상태)
    plan: str = "free"

class UserUpdate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    plan: str

    class Config:
        from_attributes = True  # ✅ Pydantic v2에서 `orm_mode=True` 대신 사용

class PaymentResponse(BaseModel):
    payment_id: str
    payer_id: str
    status: str
    amount: float
    currency: str

    class Config:
        from_attributes = True  # ✅ Pydantic v2에서는 `orm_mode` 대신 사용