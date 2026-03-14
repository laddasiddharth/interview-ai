from fastapi import FastAPI, Request
from app.routes import auth, interview, analytics
from app.database.database import Base, engine
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview AI API", version="1.0.0")

# Setup Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

@app.get("/")
@limiter.limit("20/minute")
def root(request: Request):
    return {"message": "Welcome to the Interview AI API"}
