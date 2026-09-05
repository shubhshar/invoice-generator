"""
Database Connection and Session Management

This module sets up the connection to PostgreSQL and manages database sessions.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

# Create Database Engine
# engine: The main connection to PostgreSQL
# create_engine() creates a connection pool (manages multiple connections)
# echo=False: Don't print SQL queries to console (set to True for debugging)
engine = create_engine(settings.DATABASE_URL, echo=False)

# Create Session Factory
# SessionLocal: Factory for creating new database sessions
# autocommit=False: Changes aren't saved until you explicitly commit
# autoflush=False: Changes aren't synced until you explicitly flush
# bind=engine: This factory uses our engine connection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base Class
# Base: Parent class for all database models
# All your table definitions (Invoice, InvoiceItem) inherit from this
Base = declarative_base()


def get_db():
    """
    FastAPI Dependency for Database Sessions

    This is a generator function that:
    1. Creates a new database session
    2. Yields it (provides it to route handler)
    3. Closes it when done (in finally block)

    Usage in routes:
        @app.get("/invoices")
        def get_invoices(db: Session = Depends(get_db)):
            return db.query(Invoice).all()

    The 'try/finally' ensures connection always closes, even if error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
