from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timedelta
from app.database import Base


class DelegateToken(Base):
    __tablename__ = "delegate_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tournament_id = Column(String, nullable=False, index=True)
    created_by = Column(String, nullable=False)
    token = Column(Text, nullable=False)
    permissions = Column(Text, nullable=False)
    restrictions = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    single_use = Column(Boolean, default=False)
    used = Column(Boolean, default=False)
    used_by = Column(String, nullable=True)
    used_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def is_expired(self):
        return datetime.utcnow() > self.expires_at

    @property
    def is_valid(self):
        return self.is_active and not self.is_expired and (not self.single_use or not self.used)