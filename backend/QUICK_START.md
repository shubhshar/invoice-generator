# Quick Start Guide

Complete backend setup in 5 minutes!

## Prerequisites
- Python 3.9+
- Docker (recommended, optional)
- Git

## Installation Steps

### 1️⃣ Install Python Dependencies (2 min)

```bash
cd backend
pip install -r requirements.txt
```

**What this does**: Installs FastAPI, SQLAlchemy, PostgreSQL driver, etc.

### 2️⃣ Setup Database (2 min)

#### Option A: Docker (Easiest)
```bash
docker-compose up -d
```

**What this does**: Starts PostgreSQL in a container. Database is ready immediately.

#### Option B: Manual PostgreSQL
Install PostgreSQL, then create database:
```bash
psql -U postgres
CREATE DATABASE invoice_generator;
\q
```

### 3️⃣ Configure Environment (1 min)

```bash
cp .env.example .env
```

**Edit .env** (optional, defaults should work):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_generator
SECRET_KEY=change-this-in-production
ENVIRONMENT=development
```

### 4️⃣ Run the Server (0 min)

```bash
python main.py
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
Application startup complete
```

**Server is ready!** ✅

## Test It Out

### Option 1: Interactive API Docs
Open in browser: **http://localhost:8000/docs**

- Click any endpoint
- Click "Try it out"
- Fill in data
- Click "Execute"
- See response

### Option 2: Test with curl

```bash
# Get health check
curl http://localhost:8000/health

# List all invoices
curl http://localhost:8000/api/invoices

# Create an invoice
curl -X POST http://localhost:8000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_no": "INV-001",
    "date": "2024-01-15",
    "company_name": "Shubham Aluminium",
    "company_address": "Address",
    "company_gstin": "22CPIPS7530E1ZX",
    "client_name": "Client Name",
    "client_address": "Client Address",
    "client_gstin": "GST123",
    "client_work_order": "WO-001",
    "bank_details": "Bank Name",
    "bank_account": "123456",
    "bank_ifsc": "BANKIFSC",
    "items": [
      {
        "description": "Aluminium Sheet",
        "hsn": "7606",
        "qty": 10,
        "rate": 500
      }
    ]
  }'
```

## Connecting React Frontend

In your React component:

```typescript
// Fetch all invoices
const response = await fetch('http://localhost:8000/api/invoices');
const invoices = await response.json();

// Create invoice
const response = await fetch('http://localhost:8000/api/invoices', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(invoiceData)
});
const createdInvoice = await response.json();

// Update invoice
const response = await fetch('http://localhost:8000/api/invoices/1', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(updatedData)
});

// Delete invoice
const response = await fetch('http://localhost:8000/api/invoices/1', {
  method: 'DELETE'
});
```

## File Reference

| File | Purpose |
|------|---------|
| `main.py` | App entry point, starts server |
| `config.py` | Loads settings from .env |
| `database.py` | Connects to PostgreSQL |
| `models.py` | Defines Invoice tables |
| `schemas.py` | Validates request/response data |
| `crud.py` | Database operations (Create, Read, Update, Delete) |
| `routes.py` | API endpoints |

Read **LEARNING_GUIDE.md** for detailed explanations.

## Troubleshooting

### "Module not found" Error
```bash
pip install -r requirements.txt
```

### "Database connection refused"
```bash
# Check if PostgreSQL is running
docker-compose ps

# If not, start it
docker-compose up -d

# Check logs
docker-compose logs postgres
```

### "Port 8000 already in use"
```bash
# Find process using port
lsof -i :8000

# Kill it
kill -9 <PID>
```

### "Port 5432 already in use"
```bash
# Find and kill PostgreSQL
lsof -i :5432
kill -9 <PID>

# Or stop Docker container
docker-compose down
```

## Useful Commands

```bash
# Start backend
python main.py

# Start with hot reload (auto-restart on file change)
uvicorn main:app --reload

# Start PostgreSQL (Docker)
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View PostgreSQL logs
docker-compose logs -f postgres

# Connect to database directly
docker exec -it invoice_generator_db psql -U postgres

# Install new package
pip install <package-name>
```

## API Endpoints Quick Reference

```
GET    /api/invoices              List all invoices
GET    /api/invoices/{id}         Get single invoice
POST   /api/invoices              Create invoice
PUT    /api/invoices/{id}         Update invoice
DELETE /api/invoices/{id}         Delete invoice

GET    /health                    Health check
GET    /docs                      API documentation (Swagger UI)
GET    /redoc                     Alternative API docs
```

## Environment Variables

```
DATABASE_URL    - PostgreSQL connection string
SECRET_KEY      - Secret for security (change in production!)
ENVIRONMENT     - "development" or "production"
```

Change in `.env` file (copy from `.env.example`).

## Next Steps

1. ✅ Backend running?
2. ✅ Can access http://localhost:8000/docs?
3. ✅ Can create/read/update/delete invoices?
4. → Now integrate with React frontend!

## Need Help?

1. Check **README.md** for detailed setup
2. Check **LEARNING_GUIDE.md** for concept explanations
3. View API docs: http://localhost:8000/docs
4. Check logs for errors
5. Read code comments (heavily commented for learning)

---

**Everything working?** 🎉

Now you have a complete backend ready to integrate with your React invoice generator!

**To understand HOW it works, read LEARNING_GUIDE.md** (20-30 min read but worth it!)
