"""
Configuration Management

This module handles all application settings and environment variables.
It uses Pydantic's BaseSettings to automatically load from .env file.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application Settings

    Pydantic automatically reads from .env file and validates types.
    If a variable is missing and has no default, it will raise an error.
    """

    # DATABASE_URL: Connection string for PostgreSQL
    # Format: postgresql://username:password@host:port/database_name
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/invoice_generator"

    # SECRET_KEY: Used for encryption and security
    # Should be a long random string in production
    SECRET_KEY: str = "your-secret-key-here"

    # ENVIRONMENT: Which environment are we running in?
    # Values: "development" or "production"
    ENVIRONMENT: str = "development"

    class Config:
        """
        Config nested class tells Pydantic where to find env variables.
        env_file: Read variables from .env file
        case_sensitive: Treat variable names as case-sensitive
        """
        env_file = ".env"
        case_sensitive = True


# Create a global settings object that other modules import
# Usage: from config import settings; settings.DATABASE_URL
settings = Settings()
