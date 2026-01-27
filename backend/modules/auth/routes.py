from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from jose import jwt
from typing import Dict
import uuid

from modules.auth.schemas import (
    UserCreate,
    UserLogin,
    AdminLogin,
    TokenResponse,
    RefreshTokenRequest
)

SECRET_KEY = "DEV_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/auth", tags=["Auth"])

# ===============================
# IN-MEMORY USERS (TEMP DEV)
# ===============================
_fake_users: Dict[str, dict] = {}
_fake_refresh_tokens: Dict[str, str] = {}

# ===============================
# SEED ADMIN (PLAIN PASSWORD – TEMP)
# ===============================
_fake_users["admin@instamakaan.com"] = {
    "id": "admin-1",
    "email": "admin@instamakaan.com",
    "password": "admin123",   # ✅ PLAIN (TEMP)
    "role": "ADMIN",
    "created_at": datetime.utcnow()
}

# ===============================
# TOKEN HELPERS
# ===============================
def create_access_token(subject: str, role: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "role": role,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str):
    token = str(uuid.uuid4())
    _fake_refresh_tokens[token] = subject
    return token

# ===============================
# REGISTER (USER)
# ===============================
@router.post("/register")
def register(payload: UserCreate):
    if payload.email in _fake_users:
        raise HTTPException(status_code=400, detail="User already exists")

    _fake_users[payload.email] = {
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "password": payload.password,  # ✅ PLAIN (TEMP)
        "role": "USER",
        "created_at": datetime.utcnow()
    }

    return {"message": "User registered successfully"}

# ===============================
# LOGIN (USER)
# ===============================
@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    user = _fake_users.get(payload.email)

    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"])

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }

# ===============================
# ADMIN LOGIN
# ===============================
@router.post("/admin/auth/login", response_model=TokenResponse)
def admin_login(payload: AdminLogin):
    user = _fake_users.get(payload.email)

    if not user or user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")

    if user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    access = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"])

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }

# ===============================
# REFRESH TOKEN
# ===============================
@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshTokenRequest):
    subject = _fake_refresh_tokens.get(payload.refresh_token)

    if not subject:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access = create_access_token(subject, "USER")

    return {
        "access_token": access,
        "token_type": "bearer"
    }

# ===============================
# LOGOUT
# ===============================
@router.post("/logout")
def logout(payload: RefreshTokenRequest):
    _fake_refresh_tokens.pop(payload.refresh_token, None)
    return {"message": "Logged out"}
