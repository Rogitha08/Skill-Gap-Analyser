# backend/app/api/routes_auth.py

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import get_session
from app.models.auth_tables import User
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user_id(authorization: str | None) -> int:
    """
    Extract user_id from Authorization: Bearer <token>
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ", 1)[1].strip()
    data = decode_token(token)
    uid = data.get("sub")

    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        return int(uid)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token payload")


@router.post("/signup")
async def signup(payload: dict, session: AsyncSession = Depends(get_session)):
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    full_name = (payload.get("full_name") or "").strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # bcrypt limit (72 bytes)
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 bytes or fewer")

    existing = (await session.exec(select(User).where(User.email == email))).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    u = User(email=email, full_name=full_name, password_hash=hash_password(password))
    session.add(u)
    await session.commit()
    await session.refresh(u)

    token = create_access_token({"sub": str(u.id), "email": u.email})
    return {
        "access_token": token,
        "user": {"id": u.id, "email": u.email, "full_name": u.full_name},
    }


@router.post("/login")
async def login(payload: dict, session: AsyncSession = Depends(get_session)):
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Optional: same length enforcement (prevents bcrypt 72 byte crash)
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 bytes or fewer")

    u = (await session.exec(select(User).where(User.email == email))).first()
    if not u or not verify_password(password, u.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(u.id), "email": u.email})
    return {
        "access_token": token,
        "user": {"id": u.id, "email": u.email, "full_name": u.full_name},
    }


@router.get("/me")
async def me(authorization: str | None = Header(default=None, alias="Authorization")):
    """
    Frontend can call this to validate token and get current user id.
    """
    uid = get_current_user_id(authorization)
    return {"id": uid}