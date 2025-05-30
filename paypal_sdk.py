# paypal_sdk.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"  # 실서비스는 api-m.paypal.com

def get_access_token():
    response = requests.post(
        f"{PAYPAL_BASE_URL}/v1/oauth2/token",
        headers={"Accept": "application/json"},
        auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
    )
    return response.json().get("access_token")

def create_subscription(plan_id):
    access_token = get_access_token()
    response = requests.post(
        f"{PAYPAL_BASE_URL}/v1/billing/subscriptions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
        json={
            "plan_id": plan_id,
            "application_context": {
                "brand_name": "YourApp",
                "locale": "en-US",
                "user_action": "SUBSCRIBE_NOW",
                "return_url": "http://localhost:3000/payment_success",
                "cancel_url": "http://localhost:3000/payment_fail"
            }
        }
    )
    return response.json()
