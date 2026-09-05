# Dockerfile for FastAPI Backend
# This file tells Docker how to build a container for your Python FastAPI app

# ============================================================================
# STAGE 1: Base Image Selection
# ============================================================================

FROM python:3.11-slim

# What this line does:
# - "FROM" means: start with a base image
# - "python:3.11-slim" is the starting point (pre-built image with Python 3.11)
#
# Why this specific image?
# - python:3.11-slim = Python 3.11 installed + Linux OS + minimal extras
# - "slim" = smaller file size (vs "bullseye" which has more libraries)
# - You could use "python:3.9", "python:3.12", etc.
#
# Think of it like:
# - Instead of installing Python yourself, we start with an image that has it
# - This base image is like a "template" we build on top of


# ============================================================================
# STAGE 2: Set Working Directory (Like cd in terminal)
# ============================================================================

WORKDIR /app/backend

# What this line does:
# - Sets the working directory inside the container to /app/backend
# - All future commands run from this directory
#
# Why?
# - Organizes files inside the container
# - All file paths are relative to this directory
#
# It's like:
# $ cd /app/backend
# Now you're in this folder, ready to work


# ============================================================================
# STAGE 3: Copy Requirements File (Your Dependencies List)
# ============================================================================

COPY requirements.txt .

# What this line does:
# - "COPY <source> <destination>"
# - Copies requirements.txt from your LOCAL machine → into the CONTAINER
# - The "." means: put it in current directory (/app/backend)
#
# Why in separate step?
# - Docker uses caching for speed
# - If only code changes, Docker reuses the cached layer (faster rebuilds)
# - If requirements.txt changes, Docker rebuilds from this point
#
# Result inside container:
# /app/backend/requirements.txt


# ============================================================================
# STAGE 4: Install Python Dependencies (pip install)
# ============================================================================

RUN pip install --no-cache-dir -r requirements.txt

# What this line does:
# - "RUN" = execute a command inside the container
# - "pip install -r requirements.txt" = install all packages from requirements.txt
# - "--no-cache-dir" = don't save cached files (saves space)
#
# It's like running in terminal:
# $ pip install -r requirements.txt
# But it runs INSIDE the container, not on your Mac
#
# This installs:
# - fastapi
# - uvicorn
# - sqlalchemy
# - psycopg2-binary
# - pydantic
# - etc.


# ============================================================================
# STAGE 5: Copy All Application Code
# ============================================================================

COPY . .

# What this line does:
# - Copies ALL files from your local backend/ folder → into container /app/backend/
# - "." means: copy from current directory (backend/)
# - "." means: paste into current directory in container (/app/backend/)
#
# Result inside container:
# /app/backend/main.py
# /app/backend/models.py
# /app/backend/crud.py
# /app/backend/routes.py
# /app/backend/.env
# etc.
#
# Why after pip install?
# - Docker caching: dependencies are heavy, code is light
# - If only code changes, Docker skips pip install (faster)


# ============================================================================
# STAGE 6: Expose Port (Tell Docker this container uses port 8000)
# ============================================================================

EXPOSE 8000

# What this line does:
# - Tells Docker: "This app uses port 8000"
# - It's documentation + a hint to Docker
#
# Important note:
# - EXPOSE doesn't actually open the port
# - The actual port mapping happens in docker-compose.yml (8000:8000)
# - This just says: "Hey, expect traffic on 8000"


# ============================================================================
# STAGE 7: Default Command (What runs when container starts)
# ============================================================================

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# What this line does:
# - Specifies the command to run when the container starts
# - It's like running in terminal:
#   $ uvicorn main:app --host 0.0.0.0 --port 8000 --reload
#
# Breaking it down:
# - "uvicorn" = the ASGI server (runs FastAPI)
# - "main:app" = run the 'app' object from 'main.py' file
# - "--host 0.0.0.0" = listen on all network interfaces (inside container)
#   (0.0.0.0 allows the container to receive requests from outside)
# - "--port 8000" = use port 8000 (matches EXPOSE)
# - "--reload" = auto-restart when code changes (hot reload for development)
#
# Why --reload?
# - When you edit code locally, the file syncs to container
# - Uvicorn detects the change and automatically restarts
# - You see changes instantly in browser (no manual restart needed!)


# ============================================================================
# SUMMARY: What Happens When You Run This Dockerfile?
# ============================================================================

# 1. Docker pulls python:3.11-slim base image
# 2. Sets working directory to /app/backend
# 3. Copies requirements.txt
# 4. Runs: pip install -r requirements.txt (installs all packages)
# 5. Copies all your code files
# 6. Exposes port 8000
# 7. When container starts: runs uvicorn to start FastAPI server
#
# Result:
# - A running FastAPI app at http://localhost:8000
# - Connected to PostgreSQL in docker-compose
# - Auto-reloads when you edit code


# ============================================================================
# SIZE COMPARISON
# ============================================================================

# Without Dockerfile (local Python):
# - You install Python on Mac
# - You install all packages in venv
# - Total: ~500MB+ on your machine

# With Dockerfile:
# - Python lives only in container
# - Clean Mac, clean separation
# - Container: ~400MB
# - Easy to delete/restart


# ============================================================================
# NEXT STEP: Update docker-compose.yml to use this Dockerfile
# ============================================================================
