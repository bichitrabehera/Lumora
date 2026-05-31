from sqlmodel import create_engine, SQLModel, Session
import os
from sqlalchemy import text


def normalize_database_url(raw_url: str | None) -> str:
    url = (raw_url or "sqlite:///./backend.db").strip()
    if len(url) >= 2 and url[0] == url[-1] and url[0] in {'"', "'"}:
        url = url[1:-1].strip()
    return url


DATABASE_URL = normalize_database_url(os.getenv("DATABASE_URL"))

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)

    # Simple migration: ensure `field_values` column exists on `page` table for SQLite.
    # This avoids raising an OperationalError when models gain new JSON columns.
    try:
        with engine.connect() as conn:
            if engine.url.drivername.startswith("sqlite"):
                res = conn.execute(text("PRAGMA table_info('page')")).mappings().all()
                cols = {row.get("name"): row for row in res}

                # desired columns and their SQLite types
                desired = {
                    "field_values": "JSON",
                    "template_slug": "TEXT",
                    "requested_slug": "TEXT",
                    "claim_key": "TEXT",
                    "image_url": "TEXT",
                    "is_draft": "INTEGER",
                    "is_published": "INTEGER",
                    "metadata": "JSON",
                    "published_at": "DATETIME",
                    "created_at": "DATETIME",
                    "updated_at": "DATETIME",
                    "owner_id": "INTEGER",
                    "slug": "TEXT",
                    "title": "TEXT",
                    "body": "TEXT",
                }

                for name, col_type in desired.items():
                    if name not in cols:
                        try:
                            conn.execute(
                                text(f"ALTER TABLE page ADD COLUMN {name} {col_type}")
                            )
                        except Exception:
                            # ignore individual failures and continue
                            continue
                # Ensure common Payment columns exist (page_id may be missing on older DBs)
                res_pay = conn.execute(text("PRAGMA table_info('payment')")).mappings().all()
                pay_cols = {row.get("name"): row for row in res_pay}
                pay_desired = {
                    "razorpay_order_id": "TEXT",
                    "razorpay_payment_id": "TEXT",
                    "status": "TEXT",
                    "amount": "INTEGER",
                    "currency": "TEXT",
                    "user_id": "INTEGER",
                    "page_id": "INTEGER",
                    "created_at": "DATETIME",
                }
                for name, col_type in pay_desired.items():
                    if name not in pay_cols:
                        try:
                            conn.execute(text(f"ALTER TABLE payment ADD COLUMN {name} {col_type}"))
                        except Exception:
                            continue
    except Exception:
        # If migration fails, don't crash app startup; log could be added here.
        pass


def get_session():
    with Session(engine) as session:
        yield session
