import secrets
from datetime import datetime, timedelta
from fastapi import HTTPException

from core.security import get_password_hash, verify_password, create_access_token
from core.mailer import send_email_otp
from core.database import get_db

OTP_EXPIRY_SECONDS = 120
OTP_RESEND_AFTER_SECONDS = 30
OTP_MAX_RETRIES = 5

RESET_TOKEN_EXPIRY_MINUTES = 15


def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


class UserAuthService:
    def __init__(self):
        db = get_db()
        self.users = db["users"]

    # ---------------- REGISTER / OTP ---------------- #

    async def register(self, payload):
        existing = await self.users.find_one({"email": payload.email})
        if existing:
            raise HTTPException(400, "User already exists")

        otp = generate_otp()
        now = datetime.utcnow()

        await self.users.insert_one({
            "email": payload.email,
            "password": get_password_hash(payload.password),
            "role": "TENANT",
            "is_verified": False,
            "email_otp": otp,
            "otp_expires_at": now + timedelta(seconds=OTP_EXPIRY_SECONDS),
            "otp_last_sent_at": now,
            "otp_retry_count": 0,
            "created_at": now,
        })

        await send_email_otp(payload.email, otp)
        return {"message": "OTP sent to email"}

    async def resend_otp(self, email: str):
        user = await self.users.find_one({"email": email})
        if not user:
            raise HTTPException(404, "User not found")

        now = datetime.utcnow()
        last_sent = user.get("otp_last_sent_at")

        if last_sent and (now - last_sent).seconds < OTP_RESEND_AFTER_SECONDS:
            raise HTTPException(429, "Wait before resending OTP")

        otp = generate_otp()

        await self.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "email_otp": otp,
                "otp_expires_at": now + timedelta(seconds=OTP_EXPIRY_SECONDS),
                "otp_last_sent_at": now,
                "otp_retry_count": 0,
            }}
        )

        await send_email_otp(email, otp)
        return {"message": "OTP resent"}

    async def verify_email_otp(self, payload):
        user = await self.users.find_one({"email": payload.email})
        if not user:
            raise HTTPException(404, "User not found")

        if user["otp_retry_count"] >= OTP_MAX_RETRIES:
            raise HTTPException(403, "OTP retry limit exceeded")

        if datetime.utcnow() > user["otp_expires_at"]:
            raise HTTPException(400, "OTP expired")

        if user["email_otp"] != payload.otp:
            await self.users.update_one(
                {"_id": user["_id"]},
                {"$inc": {"otp_retry_count": 1}}
            )
            raise HTTPException(400, "Invalid OTP")

        await self.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "is_verified": True,
                "email_otp": None,
                "otp_expires_at": None,
                "otp_retry_count": 0,
            }}
        )

        token = create_access_token({
            "sub": str(user["_id"]),
            "role": user["role"]
        })

        return {"access_token": token, "role": user["role"]}

    async def login(self, payload):
        user = await self.users.find_one({"email": payload.email})
        if not user:
            raise HTTPException(400, "Invalid credentials")

        if not verify_password(payload.password, user["password"]):
            raise HTTPException(400, "Invalid credentials")

        if not user["is_verified"]:
            raise HTTPException(403, "Email not verified")

        token = create_access_token({
            "sub": str(user["_id"]),
            "role": user["role"]
        })

        return {"access_token": token, "role": user["role"]}

    # FORGOT PASSWORD ---------------- #

    async def forgot_password(self, payload):
        user = await self.users.find_one({"email": payload.email})
        if not user:
            return {"message": "If the email exists, a reset link was sent"}

        token = generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)

        await self.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "reset_token": token,
                "reset_token_expires_at": expires_at,
            }}
        )

        reset_link = f"http://localhost:3000/reset-password?token={token}"
        await send_email_otp(payload.email, reset_link)

        return {"message": "Password reset link sent"}

    async def reset_password(self, payload):
        user = await self.users.find_one({
            "reset_token": payload.token
        })

        if not user:
            raise HTTPException(400, "Invalid or expired token")

        if datetime.utcnow() > user["reset_token_expires_at"]:
            raise HTTPException(400, "Reset token expired")

        await self.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "password": get_password_hash(payload.new_password),
                "reset_token": None,
                "reset_token_expires_at": None,
            }}
        )

        return {"message": "Password reset successful"}
