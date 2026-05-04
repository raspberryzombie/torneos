from sqlalchemy import Column, String, Integer, Text, Date, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    organizer_id = Column(String, ForeignKey("users.id"), nullable=True)
    venue = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    category = Column(String(20), nullable=True)  # masculino, femenino, open
    format = Column(String(20), nullable=True)  # singles, dobles, mixto
    capacity = Column(Integer, nullable=False)
    entry_fee = Column(Numeric(10, 2), nullable=True)
    status = Column(String(20), default="open")  # open, full, cancelled, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    registrations = relationship("Registration", back_populates="tournament")
    organizer = relationship("User", foreign_keys=[organizer_id])