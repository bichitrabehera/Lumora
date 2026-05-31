from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field, Column
from sqlalchemy import String, JSON


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(sa_column=Column(String, unique=True), index=True, nullable=False)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Template(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, nullable=False)
    title: str
    meta: dict = Field(default_factory=dict, sa_column=Column("metadata", JSON))
    price_cents: Optional[int] = None
    schema_def: dict = Field(default_factory=dict, alias="schema", sa_column=Column("schema", JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Lead(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    occasion: str
    template_slug: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    status: Optional[str] = None
    amount: Optional[int] = None
    currency: Optional[str] = "INR"
    user_id: Optional[int] = None
    page_id: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Page(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: Optional[int] = Field(default=None, index=True)
    slug: Optional[str] = Field(default=None, index=True)
    requested_slug: Optional[str] = Field(default=None, index=True)
    claim_key: Optional[str] = Field(default=None, index=True)
    title: str
    body: str
    image_url: Optional[str] = None
    template_slug: Optional[str] = Field(default=None, index=True)
    field_values: dict = Field(default_factory=dict, sa_column=Column("field_values", JSON))
    is_draft: bool = Field(default=True)
    is_published: bool = Field(default=False)
    meta: dict = Field(default_factory=dict, sa_column=Column("metadata", JSON))
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
