from pydantic import BaseModel, EmailStr, Field


class RegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class VerifyEmailOtpSchema(BaseModel):
    email: EmailStr
    otp: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


# 🔐 FORGOT PASSWORD
class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str = Field(min_length=8)
