import paypalrestsdk
from fastapi import FastAPI, Request, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud
from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict
import sqlite3
import openai
from paypal_sdk import create_subscription
import requests
import os
from dotenv import load_dotenv

load_dotenv()

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ✅ FastAPI 앱 인스턴스 생성
app = FastAPI()

active_connections: List[WebSocket] = []

# ✅ SQLite 데이터베이스 설정
conn = sqlite3.connect("chat.db", check_same_thread=False)
cursor = conn.cursor()

# ✅ 테이블 생성 (채팅 내역 저장)
cursor.execute("""
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    text TEXT
)
""")
conn.commit()

# ✅ 사용자 데이터 저장 (DB 대신 딕셔너리 사용, 실제 DB 연동 필요)
users_db: Dict[str, Dict] = {
    "test_user": {"api_key": "free_user_key", "credits": 10000},
}

# ✅ API 키를 생성하는 함수
def generate_api_key():
    return str(uuid.uuid4())

# ✅ API 요청 모델
class ChatRequest(BaseModel):
    message: str

# ✅ 사용자별 API 키 저장
user_api_keys: Dict[str, str] = {}

# ✅ 사용자 API 키 저장 모델
class APIKeyRequest(BaseModel):
    user_id: str
    api_key: str

# ✅ API 키 저장 엔드포인트
@app.post("/set_api_key")
async def set_api_key(request: APIKeyRequest):
    user_api_keys[request.user_id] = request.api_key
    return {"message": "API 키가 저장되었습니다."}

# ✅ DB 테이블 생성
models.Base.metadata.create_all(bind=engine)

# ✅ CORS 설정 (React 연동을 위해 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

BASE_URL = "https://api-m.sandbox.paypal.com"  # 실사용 시 api-m.paypal.com

class SubscriptionRequest(BaseModel):
    plan_id: str

def get_paypal_access_token():
    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}

    response = requests.post(f"{BASE_URL}/v1/oauth2/token", auth=auth, headers=headers, data=data)
    return response.json().get("access_token")

@app.post("/create_subscription")
def create_subscription(req: SubscriptionRequest):
    access_token = get_paypal_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    payload = {
        "plan_id": req.plan_id,
        "application_context": {
            "brand_name": "X-Project",
            "locale": "en-US",
            "shipping_preference": "NO_SHIPPING",
            "user_action": "SUBSCRIBE_NOW",
            "return_url": "http://localhost:3000/payment_success",
            "cancel_url": "http://localhost:3000/payment_fail"
        }
    }

    response = requests.post(f"{BASE_URL}/v1/billing/subscriptions", headers=headers, json=payload)

    if response.status_code == 201:
        approval_url = next(
            (link["href"] for link in response.json()["links"] if link["rel"] == "approve"),
            None
        )
        return {"approval_url": approval_url}
    else:
        print("❌ PayPal Subscription API 오류:", response.json())
        return {"error": "결제 생성 실패"}

# ✅ 사용자 인증 미들웨어 (API 키 확인 및 크레딧 차감)
def verify_user(api_key: str):
    for user, data in users_db.items():
        if data["api_key"] == api_key:
            if data["credits"] > 0:
                return user
            else:
                raise HTTPException(status_code=403, detail="🚨 크레딧이 부족합니다. 추가 구매가 필요합니다.")
    raise HTTPException(status_code=401, detail="🚨 유효하지 않은 API 키입니다.")

# ✅ 새로운 사용자 등록 및 API 키 발급
@app.post("/register/")
def register_user(username: str):
    if username in users_db:
        raise HTTPException(status_code=400, detail="🚨 이미 존재하는 사용자입니다.")

    new_api_key = generate_api_key()
    users_db[username] = {"api_key": new_api_key, "credits": 10000}  # 무료 크레딧 지급
    return {"message": "✅ 회원가입 성공!", "api_key": new_api_key}

@app.post("/create-subscription/")
def create_paypal_subscription():
    plan_id = "P-9BV44991BN5703131M7PBMOY"  # 생성한 Plan ID 넣기
    subscription = create_subscription(plan_id)
    return subscription

# ✅ 채팅 API (크레딧 차감 후 응답)
@app.post("/chat/")
def chat(request: ChatRequest, api_key: str = Depends(verify_user)):
    users_db[api_key]["credits"] -= 50  # ✅ 1회 요청 시 50 크레딧 차감 (조정 가능)
    return {"response": f"AI 응답: {request.message}"}  # 실제 AI 응답 대신 더미 텍스트

# ✅ 크레딧 조회 API
@app.get("/credits/")
def get_credits(api_key: str):
    user = verify_user(api_key)
    return {"username": user, "credits": users_db[user]["credits"]}

# ✅ 크레딧 충전 API (결제 후 적용)
@app.post("/recharge/")
def recharge_credits(api_key: str, amount: int):
    user = verify_user(api_key)
    users_db[user]["credits"] += amount
    return {"message": f"✅ {amount} 크레딧이 충전되었습니다.", "credits": users_db[user]["credits"]}

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": "Hello!"}
                    ]
            )
            reply = response["choices"][0]["message"]["content"]
            await websocket.send_json({"message": reply})
    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")

# ✅ REST API 방식 GPT 채팅
@app.post("/chat/gpt")
async def chat_with_gpt(request: ChatRequest):
    if not request.api_key:
        raise HTTPException(status_code=400, detail="API 키가 필요합니다.")

    try:
        openai.api_key = request.api_key  # 사용자 API 키 사용
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": request.message}]
        )
        return {"reply": response["choices"][0]["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ API 키 확인 엔드포인트
@app.get("/get_api_key/{user_id}")
async def get_api_key(user_id: str):
    return {"api_key": user_api_keys.get(user_id, "❌ API 키 없음")}

# ✅ DB 세션 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Pydantic 모델 정의
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# ✅ 채팅 API: 사용자 입력 → AI 응답
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = f"AI 응답: {request.message[::-1]}"  # 예제: 입력 메시지 반전

    # ✅ 데이터베이스에 저장
    cursor.execute("INSERT INTO chat_history (sender, text) VALUES (?, ?)", ("user", request.message))
    cursor.execute("INSERT INTO chat_history (sender, text) VALUES (?, ?)", ("ai", reply))
    conn.commit()

    return ChatResponse(reply=reply)

# ✅ 채팅 내역 불러오기 API
@app.get("/chat/history")
async def get_chat_history():
    cursor.execute("SELECT sender, text FROM chat_history")
    history = [{"sender": row[0], "text": row[1]} for row in cursor.fetchall()]
    return history

# ✅ 결제 승인 요청 모델
class PayPalExecuteRequest(BaseModel):
    payment_id: str
    payer_id: str

# ✅ PayPal 결제 승인 API
@app.post("/execute_payment")
def execute_payment(request: PayPalExecuteRequest, db: Session = Depends(get_db)):
    existing_payment = db.query(models.Payment).filter_by(payment_id=request.payment_id).first()

    if existing_payment:
        print("⚠️ 이미 승인된 결제:", request.payment_id)
        return {"message": "Payment already executed", "payment": existing_payment.to_dict()}

    payment = paypalrestsdk.Payment.find(request.payment_id)

    if payment.execute({"payer_id": request.payer_id}):
        print("✅ Payment executed successfully")

        new_payment = models.Payment(
            payment_id=request.payment_id,
            payer_id=request.payer_id,
            status="completed",
            amount=str(payment.transactions[0].amount["total"]),  # FastAPI에서 문자열로 변환
            currency=payment.transactions[0].amount["currency"]
        )
        db.add(new_payment)
        db.commit()

        return {
            "message": "Payment successful",
            "payment_id": new_payment.payment_id,
            "payer_id": new_payment.payer_id,
            "amount": new_payment.amount,
            "currency": new_payment.currency,
        }
    else:
        print("❌ Payment execution error: 400 - Payment execution failed")
        raise HTTPException(status_code=400, detail="Payment execution failed")

# ✅ 사용자 추가 API
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

# ✅ 사용자 조회 API
@app.get("/users/", response_model=list[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

# ✅ 사용자 수정 API
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    return crud.update_user(db, user_id, user)

# ✅ 사용자 삭제 API
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    crud.delete_user(db, user_id)
    return {"message": "User deleted successfully"}

# ✅ PayPal API 설정 (Sandbox)
paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": "ATmCIBJ3nmvsDkwo3afFULqUe0EON_xbmNiDD3wMntN8ZOjouKbSw9QmK9yFiCgpfncwetmeHbYkyL2Z",
    "client_secret": "EDJa0ne9Va8PCGL1hZXuK_A4NOhDI9rB6-z3PBlu8BY7Wz3pmqGGe60V8MLeRFUM89-0tM4BqoFHwhe3"
})

# ✅ PayPal 결제 요청 모델
class PayPalPaymentRequest(schemas.BaseModel):
    email: str
    plan: str  # "standard", "extended", "premium"

# ✅ PayPal 결제 요청 API
@app.post("/paypal_checkout")
def create_paypal_payment(request: PayPalPaymentRequest):
    plan_prices = {"standard": "39.00", "extended": "79.00", "premium": "99.00"}

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "http://localhost:3000/payment_success",
            "cancel_url": "http://localhost:3000/payment_cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": f"{request.plan} Plan",
                    "sku": request.plan,
                    "price": plan_prices.get(request.plan, "0.00"),
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "total": plan_prices.get(request.plan, "0.00"),
                "currency": "USD"
            },
            "description": f"Purchase of {request.plan} Plan"
        }]
    })

    if payment.create():
        for link in payment.links:
            if link.rel == "approval_url":
                return {"approval_url": link.href}
    raise HTTPException(status_code=400, detail="Payment creation failed")

# 예시: 결제 성공 후 호출되는 API
@app.post("/update-payment-status")
async def update_payment_status(request: Request):
    data = await request.json()
    user_email = data.get("email")
    # 실제 DB에 저장된 유저 정보 업데이트
    # 예: user.is_paid = True
    print(f"✅ {user_email} 사용자의 결제 상태가 업데이트되었습니다.")
    return {"status": "success"}

# PayPal 구독 웹훅 처리
@app.post("/paypal/webhook")
async def paypal_webhook(request: Request):
    data = await request.json()
    subscription_id = data.get("subscriptionID")

    # ✅ 여기에서 subscription_id를 DB에 저장하거나 사용자 상태 업데이트
    print(f"✅ 구독 완료! Subscription ID: {subscription_id}")

    return {"status": "ok"}

@app.post("/api/payment-success")
async def payment_success(request: Request):
    data = await request.json()
    print("✅ 결제 완료 정보:", data)
    # 👉 결제 정보를 DB에 저장하는 로직을 여기에 추가할 수 있음
    return {"status": "success"}

# ✅ 결제 내역 조회 API
@app.get("/payments/", response_model=list[schemas.PaymentResponse])
def get_payments(db: Session = Depends(get_db)):
    payments = db.query(models.Payment).all()
    return payments

