from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/templates", tags=["templates"])

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = PROJECT_ROOT / "content" / "site-data.json"


def load_site_data() -> dict[str, Any]:
    with DATA_PATH.open("r", encoding="utf-8") as handle:
      return json.load(handle)


@router.get("")
def list_templates() -> list[dict[str, Any]]:
    return load_site_data().get("templates", [])


@router.get("/{slug}")
def get_template(slug: str) -> dict[str, Any]:
    template = next(
        (
            item
            for item in load_site_data().get("templates", [])
            if item.get("slug") == slug
        ),
        None,
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
