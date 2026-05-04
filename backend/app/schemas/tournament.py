from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal


class TournamentBase(BaseModel):
    name: str
    description: Optional[str] = None
    venue: str
    address: Optional[str] = None
    start_date: date
    end_date: date
    category: Optional[str] = None
    format: Optional[str] = None
    capacity: int
    entry_fee: Optional[Decimal] = None


class TournamentCreate(TournamentBase):
    pass


class TournamentResponse(TournamentBase):
    id: str
    organizer_id: Optional[str] = None
    organizer_name: Optional[str] = None
    status: str
    created_at: datetime
    registered_count: int = 0
    is_registered: bool = False

    class Config:
        from_attributes = True


class TournamentListResponse(BaseModel):
    id: str
    name: str
    venue: str
    start_date: date
    category: Optional[str] = None
    format: Optional[str] = None
    capacity: int
    entry_fee: Optional[Decimal] = None
    status: str
    registered_count: int = 0
    is_registered: bool = False

    class Config:
        from_attributes = True


class RegistrationResponse(BaseModel):
    id: str
    tournament_id: str
    user_id: str
    status: str
    registered_at: datetime

    class Config:
        from_attributes = True


class RegistrationCreate(BaseModel):
    tournament_id: str