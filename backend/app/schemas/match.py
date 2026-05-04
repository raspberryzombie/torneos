from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class MatchResponse(BaseModel):
    id: str
    tournament_id: str
    tournament_name: str
    round: Optional[str] = None
    opponent_id: Optional[str] = None
    opponent_name: Optional[str] = None
    court: Optional[str] = None
    scheduled_at: datetime
    score: Optional[Dict[str, Any]] = None
    status: str

    class Config:
        from_attributes = True


class MatchListResponse(BaseModel):
    today: list[MatchResponse]
    upcoming: list[MatchResponse]
    registrations: list[dict]