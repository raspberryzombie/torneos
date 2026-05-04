from app.api.auth import router as auth_router
from app.api.tournaments import router as tournaments_router
from app.api.matches import router as matches_router
from app.api.delegates import router as delegates_router

__all__ = ["auth_router", "tournaments_router", "matches_router", "delegates_router"]