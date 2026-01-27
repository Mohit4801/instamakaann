from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path
import logging
import time

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from core.config import APP_NAME, CORS_ORIGINS
from core.database import close_db, get_db

from modules.auth.routes import router as auth_router
from modules.listings.routes import router as listings_router
from modules.leads.routes import router as leads_router
from modules.owners.routes import router as owners_router
from modules.agents.routes import router as agents_router
from modules.properties.routes import router as properties_router
from modules.inquiries.routes import router as inquiries_router
from modules.dashboard.routes import router as dashboard_router
from modules.whatsapp.webhook import router as whatsapp_webhook_router
from modules.user_auth.router import router as user_auth_router


BASE_DIR = Path(__file__).parent

app = FastAPI(title=APP_NAME)

# =========================
# LOGGING 
# =========================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(APP_NAME)

# =========================
# REQUEST LOGGING MIDDLEWARE
# =========================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = round((time.time() - start_time) * 1000, 2)

    logger.info(
        f"{request.method} {request.url.path} "
        f"status={response.status_code} "
        f"duration_ms={duration}"
    )

    return response

# =========================
# RATE LIMITER 
# =========================

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests"}
    )

# =========================
# GLOBAL ERROR HANDLER 
# =========================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# =========================
# STATIC UPLOADS
# =========================

app.mount(
    "/uploads",
    StaticFiles(directory=BASE_DIR / "uploads"),
    name="uploads"
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================

app.include_router(auth_router, prefix="/api")
app.include_router(listings_router, prefix="/api")
app.include_router(leads_router, prefix="/api")
app.include_router(owners_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
app.include_router(properties_router, prefix="/api")
app.include_router(inquiries_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(whatsapp_webhook_router)
app.include_router(user_auth_router)

# =========================
# HEALTH CHECK 
# =========================

@app.get("/health", tags=["System"])
async def health_check():
    db = get_db()
    await db.command("ping")
    return {"status": "ok"}

# =========================
# SHUTDOWN
# =========================

@app.on_event("shutdown")
async def shutdown():
    close_db()
