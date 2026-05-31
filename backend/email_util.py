from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage


def send_email(to: str, subject: str, body: str) -> None:
    host = os.getenv("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASS")

    msg = EmailMessage()
    msg["From"] = user or "no-reply@example.com"
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    if not host:
        raise RuntimeError("SMTP_HOST not configured")

    with smtplib.SMTP(host, port) as smtp:
        smtp.starttls()
        if user and password:
            smtp.login(user, password)
        smtp.send_message(msg)
