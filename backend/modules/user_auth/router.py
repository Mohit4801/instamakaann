from fastapi import APIRouter, Body
from modules.user_auth.schemas import (
    RegisterSchema,
    VerifyEmailOtpSchema,
    LoginSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
)
from modules.user_auth.service import UserAuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(payload: RegisterSchema):
    return await UserAuthService().register(payload)


@router.post("/verify-email")
async def verify_email(payload: VerifyEmailOtpSchema):
    return await UserAuthService().verify_email_otp(payload)


@router.post("/resend-otp")
async def resend_otp(email: str = Body(..., embed=True)):
    return await UserAuthService().resend_otp(email)


@router.post("/login")
async def login(payload: LoginSchema):
    return await UserAuthService().login(payload)


# 🔐 FORGOT PASSWORD
@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordSchema):
    return await UserAuthService().forgot_password(payload)


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordSchema):
    return await UserAuthService().reset_password(payload)
