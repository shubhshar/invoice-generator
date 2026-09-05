"""
FastAPI Application Entry Point

This is the main file that runs the backend server.
It sets up the FastAPI app, routes, CORS, and database.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import router
from config import settings

# ==================== CREATE DATABASE TABLES ====================

# Create all tables defined in models.py
# This runs once when the app starts
# If tables already exist, they're left untouched
Base.metadata.create_all(bind=engine)

# ==================== CREATE FASTAPI APP ====================

app = FastAPI(
    title="Invoice Generator API",
    description="Backend API for Invoice Generator with FastAPI and PostgreSQL",
    version="1.0.0"
)

# ==================== SETUP CORS ====================

"""
CORS = Cross-Origin Resource Sharing

Why needed:
- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:8000
- Browsers block cross-origin requests by default (security feature)
- CORS tells browser: "It's OK, these services trust each other"

allow_origins:
- "*": Allow all origins (not safe for production!)
- ["http://localhost:3000"]: Only allow frontend localhost

allow_credentials=True: Allow sending cookies with requests
allow_methods=["*"]: Allow all HTTP methods (GET, POST, etc.)
allow_headers=["*"]: Allow all headers
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== INCLUDE ROUTES ====================

# Include the routes from routes.py
# All routes will be prefixed with /api/invoices
app.include_router(router)

# ==================== ROOT ENDPOINT ====================

@app.get("/")
def read_root():
    """
    Root endpoint

    Returns:
    Simple message to verify API is running

    Example:
    GET http://localhost:8000/
    Response: {"message": "Invoice Generator API is running"}
    """
    return {"message": "Invoice Generator API is running"}


@app.get("/health")
def health_check():
    """
    Health check endpoint

    Used by monitoring tools to verify the service is up.
    Returns a simple OK response.

    Example:
    GET http://localhost:8000/health
    Response: {"status": "ok"}
    """
    return {"status": "ok"}


# ==================== RUN THE APP ====================

"""
When you run this file directly (not imported):
python main.py

Or with uvicorn:
uvicorn main:app --reload

--reload: Auto-restart on file changes (useful for development)

The app will be available at:
http://localhost:8000

Interactive API docs (Swagger UI):
http://localhost:8000/docs

Alternative API docs (ReDoc):
http://localhost:8000/redoc
"""

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Listen on all network interfaces
        port=8000,  # Port to run on
        reload=True  # Auto-restart on file changes
    )
