from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import chat, evaluate

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(evaluate.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Interview AI API"}
