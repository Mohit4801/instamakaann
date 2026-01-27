from datetime import datetime, timedelta, timezone
from typing import Optional, List
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt

from core.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from core.database import get_db

# =========================
# PASSWORD UTILS
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# =========================
# JWT CONFIG
# =========================

REFRESH_TOKEN_EXPIRE_DAYS = 7
ISSUER = "instamakaan"
AUDIENCE = "instamakaan_users"

security = HTTPBearer()

# =========================
# TOKEN HELPERS
# =========================

def _base_payload(data: dict):
    return {
        **data,
        "iat": datetime.now(timezone.utc),
        "iss": ISSUER,
        "aud": AUDIENCE,
        "jti": str(uuid4()),
    }

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
):
    payload = _base_payload(data)
    payload["type"] = "access"
    payload["exp"] = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(data: dict):
    payload = _base_payload(data)
    payload["type"] = "refresh"
    payload["exp"] = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# =========================
# TOKEN DECODER
# =========================

def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            audience=AUDIENCE,
            issuer=ISSUER,
        )
    except JWTError:
        return None

# =========================
# CURRENT USER
# =========================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db),
):
    payload = decode_token(credentials.credentials)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await db.users.find_one({"id": user_id}, {"_id": 0})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    #NORMALIZE ROLE
    if "role" in user and isinstance(user["role"], str):
        user["role"] = user["role"].upper()

    return user

# =========================
# ROLE-BASED ACCESS CONTROL
# =========================

def require_role(roles: List[str]):
    normalized_roles = [r.upper() for r in roles]

    async def checker(user=Depends(get_current_user)):
        if user.get("role") not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden"
            )
        return user

    return checker
