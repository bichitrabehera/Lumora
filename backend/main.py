from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi import Depends
from sqlmodel import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "content" / "site-data.json"

with DATA_PATH.open("r", encoding="utf-8") as handle:
    SITE_DATA: dict[str, Any] = json.load(handle)

app = FastAPI(title="lovey page API", version="1.0.0")

# Import DB and routers
from backend.db import init_db, get_session
from backend.routers.auth import router as auth_router
from backend.routers.uploads import router as uploads_router
from backend.routers.payments import router as payments_router
from backend.routers.pages import router as pages_router
from backend.routers.qr import router as qr_router
from backend.routers.templates import router as templates_router
from backend.notifications import notify_new_lead, notify_lead_received
from backend.models import Lead

app.include_router(auth_router)
app.include_router(uploads_router)
app.include_router(payments_router)
app.include_router(pages_router)
app.include_router(qr_router)
app.include_router(templates_router)


@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

leads: list[dict[str, Any]] = []


class LeadSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=120)
    occasion: str = Field(min_length=2, max_length=80)
    template_slug: str = Field(default="", max_length=120)
    message: str = Field(min_length=10, max_length=1000)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": app.version}


@app.get("/api/site-data")
def get_site_data() -> dict[str, Any]:
    return SITE_DATA


@app.post("/api/leads")
def create_lead(submission: LeadSubmission, session=Depends(get_session)) -> dict[str, Any]:
    template = None
    if submission.template_slug:
        template = next(
            (
                item
                for item in SITE_DATA["templates"]
                if item.get("slug") == submission.template_slug
            ),
            None,
        )

    lead_row = Lead(
        name=submission.name.strip(),
        email=submission.email.strip(),
        occasion=submission.occasion.strip(),
        template_slug=submission.template_slug.strip(),
        message=submission.message.strip(),
    )
    session.add(lead_row)
    session.commit()
    session.refresh(lead_row)

    lead = {
        "id": str(lead_row.id),
        "createdAt": lead_row.created_at.isoformat(),
        "name": lead_row.name,
        "email": lead_row.email,
        "occasion": lead_row.occasion,
        "templateSlug": lead_row.template_slug,
        "message": lead_row.message,
    }
    leads.append(lead)

    try:
        notify_new_lead(
            lead_row.name,
            lead_row.email,
            lead_row.occasion,
            template.get("title") if template else None,
            lead_row.message,
        )
    except Exception:
        pass

    try:
        notify_lead_received(lead_row.email, lead_row.name)
    except Exception:
        pass

    return {
        "ok": True,
        "lead": lead,
        "template": template,
    }


@app.get("/api/leads")
def list_leads() -> dict[str, Any]:
    return {"count": len(leads), "items": leads}


