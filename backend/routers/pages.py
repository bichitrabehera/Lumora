from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from pathlib import Path
import json
from pydantic import BaseModel
from sqlmodel import select
import bleach
import re

from backend.db import get_session
from backend.models import Page, User, Payment
from backend.auth_utils import get_current_user
from backend.notifications import notify_page_published

router = APIRouter(prefix="/api/pages", tags=["pages"])


def slugify(value: str) -> str:
    value = value.lower().strip()
    # replace non alnum with hyphens
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")


ALLOWED_TAGS = list(bleach.sanitizer.ALLOWED_TAGS) + ["p", "h1", "h2", "h3", "img", "br"]
# Copy attributes and ensure values are lists (bleach may use frozenset)
_allowed_attrs = {k: list(v) if not isinstance(v, list) else v for k, v in bleach.sanitizer.ALLOWED_ATTRIBUTES.items()}
_allowed_attrs.setdefault("img", []).extend(["src", "alt"])
ALLOWED_ATTRS = _allowed_attrs


class PageCreate(BaseModel):
    title: str
    body: str
    image_url: str | None = None
    template_slug: str | None = None
    requested_slug: str | None = None
    field_values: dict | None = None
    is_draft: bool | None = True


def account_name_for_user(user: User) -> str:
    email = (user.email or "").strip().lower()
    local_part = email.split("@", 1)[0] if email else "user"
    return slugify(local_part) or "user"


def normalize_requested_slug(value: str | None) -> str:
    if not value:
        return ""
    return slugify(value)


def build_claim_key(user: User, requested_slug: str) -> str:
    return normalize_requested_slug(requested_slug)


def build_final_page_slug(user: User, page: Page) -> str:
    account_name = account_name_for_user(user)
    requested = normalize_requested_slug(page.requested_slug or page.title or "page")
    template_part = slugify(page.template_slug or "page") or "page"
    base = "-".join(part for part in [account_name, requested, template_part] if part)
    return slugify(base) or "page"


@router.post("/", response_model=dict)
def create_page(payload: PageCreate, user=Depends(get_current_user), session=Depends(get_session)):
    clean_body = bleach.clean(payload.body or "", tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS)
    requested_slug = normalize_requested_slug(payload.requested_slug)
    if requested_slug:
        existing = session.exec(
            select(Page).where(Page.claim_key == build_claim_key(user, requested_slug))
        ).first()
        if existing:
          raise HTTPException(status_code=409, detail="That URL is already claimed")
    page = Page(
        owner_id=user.id,
        title=payload.title.strip(),
        body=clean_body,
        image_url=payload.image_url,
        template_slug=payload.template_slug,
        requested_slug=requested_slug or None,
        claim_key=build_claim_key(user, requested_slug) if requested_slug else None,
        field_values=payload.field_values or {},
        is_draft=bool(payload.is_draft),
    )
    session.add(page)
    session.commit()
    session.refresh(page)
    return {"ok": True, "page": page}


@router.put("/{page_id}", response_model=dict)
def update_page(page_id: int, payload: PageCreate, user=Depends(get_current_user), session=Depends(get_session)):
    statement = select(Page).where(Page.id == page_id, Page.owner_id == user.id)
    page = session.exec(statement).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    page.title = payload.title.strip()
    page.body = bleach.clean(payload.body or "", tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS)
    page.image_url = payload.image_url
    page.template_slug = payload.template_slug
    requested_slug = normalize_requested_slug(payload.requested_slug)
    if requested_slug:
        existing = session.exec(
            select(Page).where(
                Page.claim_key == build_claim_key(user, requested_slug),
                Page.id != page.id,
            )
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="That URL is already claimed")
    page.requested_slug = requested_slug or None
    page.claim_key = build_claim_key(user, requested_slug) if requested_slug else None
    page.field_values = payload.field_values or {}
    if payload.is_draft is not None:
        page.is_draft = bool(payload.is_draft)
    session.add(page)
    session.commit()
    session.refresh(page)
    return {"ok": True, "page": page}


@router.post("/{page_id}/publish")
def publish_page(page_id: int, user=Depends(get_current_user), session=Depends(get_session)):
    statement = select(Page).where(Page.id == page_id, Page.owner_id == user.id)
    page = session.exec(statement).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    # Ensure required template fields exist before publishing
    if page.template_slug and (not page.field_values or len(page.field_values) == 0):
        raise HTTPException(status_code=400, detail="Template fields missing")

    if page.template_slug and not page.requested_slug:
        raise HTTPException(status_code=400, detail="Claim URL is required before publishing")

    # Determine if this template is free by reading content/site-data.json
    project_root = Path(__file__).resolve().parents[2]
    site_path = project_root / "content" / "site-data.json"
    try:
        with site_path.open("r", encoding="utf-8") as fh:
            site = json.load(fh)
        tpl = next((t for t in site.get("templates", []) if t.get("slug") == page.template_slug), None)
        price_str = tpl.get("price") if tpl else None
    except Exception:
        price_str = None

    is_free = False
    if price_str and isinstance(price_str, str) and "free" in price_str.lower():
        is_free = True

    if page.requested_slug:
        existing_claim = session.exec(
            select(Page).where(
                Page.claim_key == build_claim_key(user, page.requested_slug),
                Page.id != page.id,
            )
        ).first()
        if existing_claim:
            raise HTTPException(status_code=409, detail="That URL is already claimed")

    # If not free, require a successful payment tied to the page
    if not is_free:
        stmt = select(Payment).where(Payment.page_id == page.id)
        pay = session.exec(stmt).first()
        if not pay or (pay.status or "").lower() not in ("paid", "captured", "completed"):
            raise HTTPException(status_code=402, detail="Payment required to publish")
    slug = build_final_page_slug(user, page)
    suffix = 0
    # ensure uniqueness
    while True:
        check = session.exec(select(Page).where(Page.slug == slug)).first()
        if not check or check.id == page.id:
            break
        suffix += 1
        slug = f"{build_final_page_slug(user, page)}-{suffix}"

    page.slug = slug
    page.is_published = True
    page.is_draft = False
    page.published_at = datetime.utcnow()
    session.add(page)
    session.commit()
    session.refresh(page)
    owner = session.get(User, page.owner_id) if page.owner_id else None
    try:
        notify_page_published(owner.email if owner else None, page.title, page.slug or slug)
    except Exception:
        # Publication must not fail because email delivery is misconfigured.
        pass
    return {"ok": True, "page": page}


@router.get("/mine")
def list_my_pages(user=Depends(get_current_user), session=Depends(get_session)):
    statement = select(Page).where(Page.owner_id == user.id)
    items = session.exec(statement).all()
    return {"items": items}


@router.get("/{slug}")
def get_page_by_slug(slug: str, session=Depends(get_session)):
    statement = select(Page).where(Page.slug == slug, Page.is_published == True)
    page = session.exec(statement).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.delete("/{page_id}")
def delete_page(page_id: int, user=Depends(get_current_user), session=Depends(get_session)):
    statement = select(Page).where(Page.id == page_id, Page.owner_id == user.id)
    page = session.exec(statement).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    session.delete(page)
    session.commit()
    return {"ok": True, "detail": "Page deleted successfully"}
