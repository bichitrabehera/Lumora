from __future__ import annotations

import os
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlmodel import select

import razorpay
import os

from backend.db import get_session
from backend.models import Payment
from backend.notifications import notify_payment_received

router = APIRouter(prefix="/api/payments", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")


class CreateOrderPayload(BaseModel):
    amount: int  # rupees
    page_id: int | None = None


@router.post("/create-order")
def create_order(payload: CreateOrderPayload, session=Depends(get_session)):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    # Razorpay expects amount in paise
    amount_paise = payload.amount * 100
    order = client.order.create({"amount": amount_paise, "currency": "INR", "payment_capture": 1})

    # persist payment order
    payment = Payment(
        razorpay_order_id=order.get("id"),
        amount=payload.amount,
        status=order.get("status"),
        page_id=payload.page_id,
    )
    session.add(payment)
    session.commit()
    session.refresh(payment)

    return {"ok": True, "order": order, "key": RAZORPAY_KEY_ID}


class ConfirmPayload(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/confirm")
def confirm_payment(payload: ConfirmPayload, session=Depends(get_session)):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    params = {
        "razorpay_order_id": payload.razorpay_order_id,
        "razorpay_payment_id": payload.razorpay_payment_id,
        "razorpay_signature": payload.razorpay_signature,
    }
    try:
        client.utility.verify_payment_signature(params)
    except Exception:
        raise HTTPException(status_code=400, detail="Signature verification failed")

    statement = select(Payment).where(Payment.razorpay_order_id == payload.razorpay_order_id)
    payment = session.exec(statement).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
    payment.razorpay_payment_id = payload.razorpay_payment_id
    payment.status = "paid"
    session.add(payment)
    session.commit()
    session.refresh(payment)
    notify_payment_received(payload.razorpay_order_id, payload.razorpay_payment_id, payment.amount, payment.status)
    return {"ok": True, "payment": payment}


@router.post("/webhook")
async def razorpay_webhook(request: Request, session=Depends(get_session)):
    payload = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")
    if not RAZORPAY_WEBHOOK_SECRET or not signature:
        raise HTTPException(status_code=400, detail="Webhook not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    try:
        client.utility.verify_webhook_signature(payload, signature, RAZORPAY_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # parse JSON
    import json

    event = json.loads(payload)
    # handle payment.captured
    if event.get("event") == "payment.captured":
        data = event.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = data.get("order_id")
        payment_id = data.get("id")
        statement = select(Payment).where(Payment.razorpay_order_id == order_id)
        payment = session.exec(statement).first()
        if payment:
            payment.razorpay_payment_id = payment_id
            payment.status = data.get("status")
            session.add(payment)
            session.commit()
            notify_payment_received(order_id or "", payment_id or "", payment.amount, payment.status)

    return {"ok": True}
