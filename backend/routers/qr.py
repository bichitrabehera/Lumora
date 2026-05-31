from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from backend.db import get_session
from backend.models import Page
from backend.qr_util import generate_qr_base64
import os

router = APIRouter(prefix="/api/qr", tags=["qr"])


@router.get("/page/{page_id}")
def page_qr(page_id: int, session=Depends(get_session)):
    statement = select(Page).where(Page.id == page_id, Page.is_published == True)
    page = session.exec(statement).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found or not published")

    frontend = (os.getenv("FRONTEND_URL") or os.getenv("NEXT_PUBLIC_FRONTEND_URL") or "http://localhost:3000").rstrip("/")
    url = f"{frontend}/p/{page.slug}"
    b64 = generate_qr_base64(url)
    return {"ok": True, "data": f"data:image/png;base64,{b64}"}
