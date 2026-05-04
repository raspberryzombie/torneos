from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base


class Match(Base):
    __tablename__ = "matches"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tournament_id = Column(String, ForeignKey("tournaments.id"), nullable=False)
    round = Column(String(20), nullable=True)
    player1_id = Column(String, ForeignKey("users.id"), nullable=True)
    player2_id = Column(String, ForeignKey("users.id"), nullable=True)
    court = Column(String(50), nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    score = Column(JSON, nullable=True)
    winner_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="scheduled")  # scheduled, in_progress, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    tournament = relationship("Tournament")
    player1 = relationship("User", foreign_keys=[player1_id])
    player2 = relationship("User", foreign_keys=[player2_id])
    winner = relationship("User", foreign_keys=[winner_id])