from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from app.database import engine, Base
from app.api.auth import router as auth_router
from app.api.tournaments import router as tournaments_router
from app.api.matches import router as matches_router
from app.api.delegates import router as delegates_router
from app.config import get_settings

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Torneos API", version="1.0.0")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Demasiadas solicitudes. Intenta de nuevo más tarde."}
    )

app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tournaments_router)
app.include_router(matches_router)
app.include_router(delegates_router)


@app.get("/")
def read_root():
    return {"message": "Torneos API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)