from __future__ import annotations

import os
from typing import Iterable

from backend.email_util import send_email


def _admin_recipients() -> list[str]:
    raw = os.getenv("ADMIN_EMAILS", "")
    recipients = [item.strip() for item in raw.split(",") if item.strip()]
    fallback = os.getenv("SMTP_USER", "").strip()
    if not recipients and fallback:
        recipients = [fallback]
    return recipients


def _send_to_admins(subject: str, body: str) -> None:
    recipients = _admin_recipients()
    for recipient in recipients:
        send_email(recipient, subject, body)


def notify_new_lead(name: str, email: str, occasion: str, template_title: str | None, message: str) -> None:
    subject = f"New lead request from {name}"
    body = (
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Occasion: {occasion}\n"
        f"Template: {template_title or 'N/A'}\n\n"
        f"Message:\n{message}\n"
    )
    _send_to_admins(subject, body)


def notify_lead_received(email: str, name: str) -> None:
    subject = "We received your request"
    body = (
        f"Hi {name},\n\n"
        "We received your request and will reply shortly.\n\n"
        "Thanks,\nCutiepage"
    )
    send_email(email, subject, body)


def notify_page_published(email: str | None, title: str, slug: str) -> None:
    subject = f"Your page is live: {title}"
    body = (
        f"Your page is published.\n\n"
        f"Title: {title}\n"
        f"Slug: {slug}\n"
        f"Link: /p/{slug}\n"
    )
    if email:
        send_email(email, subject, body)
    _send_to_admins(f"Published: {title}", body)


def notify_payment_received(order_id: str, payment_id: str, amount: int | None, status: str | None) -> None:
    subject = f"Payment updated: {order_id}"
    body = (
        f"Order ID: {order_id}\n"
        f"Payment ID: {payment_id}\n"
        f"Amount: {amount if amount is not None else 'N/A'}\n"
        f"Status: {status or 'unknown'}\n"
    )
    _send_to_admins(subject, body)
