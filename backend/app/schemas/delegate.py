from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DelegateQRCreate(BaseModel):
    hours_valid: int = 24
    single_use: bool = False


class DelegateQRResponse(BaseModel):
    qr_code: str
    token_id: str
    expires_at: str
    single_use: bool


class DelegateSessionResponse(BaseModel):
    id: str
    tournament_id: str
    created_by: str
    created_by_name: Optional[str] = None
    activated_by: Optional[str] = None
    activated_by_name: Optional[str] = None
    expires_at: datetime
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class DelegateActivateRequest(BaseModel):
    token: str


class DelegateActivateResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    permissions: List[str]
    restrictions: List[str]
    tournament_id: str
    expires_at: str


class DelegatePermissions(BaseModel):
    tournament_id: str
    permissions: List[str]
    restrictions: List[str]
    expires_at: str
    delegate_name: Optional[str] = None