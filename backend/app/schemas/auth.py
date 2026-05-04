from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = Field(None, ge=1, le=10)
    preferred_hand: Optional[str] = None
    photo_url: Optional[str] = None


class UserResponse(UserBase):
    id: str
    photo_url: Optional[str] = None
    level: Optional[int] = None
    preferred_hand: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None