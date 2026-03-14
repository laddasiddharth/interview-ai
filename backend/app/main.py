from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, interview, analytics
from app.database.database import Base, engine
from routers import chat, evaluate
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview AI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(chat.router)
app.include_router(evaluate.router)

@app.get("/")
@limiter.limit("20/minute")
def root(request: Request):
    return {"message": "Welcome to the Interview AI API"}
