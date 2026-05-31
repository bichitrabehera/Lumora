from __future__ import annotations

import os
from typing import Optional

from fastapi import Depends, HTTPException, Request
from jose import JWTError, jwt
from sqlmodel import Session, select

from backend.db import get_session
from backend.models import User

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "devsecret")
ALGORITHM = "HS256"


def get_current_user(request: Request, session: Session = Depends(get_session)) -> Optional[User]:
    auth = request.headers.get("authorization") or ""
    if not auth.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization")

    token = auth.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    statement = select(User).where(User.id == int(sub))
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
