from __future__ import annotations

import os
import time
from typing import Any

from fastapi import APIRouter
import cloudinary
from cloudinary.utils import api_sign_request

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
api_key = os.getenv("CLOUDINARY_API_KEY")
api_secret = os.getenv("CLOUDINARY_API_SECRET")


@router.get("/sign")
def sign_upload():
    """Return signature and params for a signed direct upload to Cloudinary."""
    timestamp = int(time.time())
    params_to_sign = {"timestamp": timestamp}
    signature = api_sign_request(params_to_sign, api_secret)
    return {"cloud_name": cloud_name, "api_key": api_key, "timestamp": timestamp, "signature": signature}
