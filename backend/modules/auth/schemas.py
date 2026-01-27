from pydantic import BaseModel, EmailStr, Field, validator

MAX_PASSWORD_BYTES = 72


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @validator("password")
    def password_length_limit(cls, v: str):
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(
                "Password too long (max 72 characters allowed)"
            )
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def password_length_limit(cls, v: str):
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(
                "Password too long (max 72 characters allowed)"
            )
        return v


class AdminLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def password_length_limit(cls, v: str):
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(
                "Password too long (max 72 characters allowed)"
            )
        return v


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
