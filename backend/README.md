# Invoice Generator Backend

A FastAPI backend service with PostgreSQL database for the Invoice Generator application.

## Architecture Overview

```
Frontend (React)          Backend (FastAPI)        Database (PostgreSQL)
http://localhost:3000  ←→  http://localhost:8000  ←→  localhost:5432
     |                          |                        |
  Invoice                   API Routes              Invoices Table
  Editor                   (CRUD Operations)      InvoiceItems Table
```

## File Structure Explanation

### Core Files

1. **main.py** - Application Entry Point
   - Creates FastAPI app
   - Sets up CORS (allows frontend to communicate)
   - Initializes database tables
   - Defines health check endpoints

2. **config.py** - Configuration Management
   - Reads environment variables from `.env`
   - Uses Pydantic for validation
   - Centralizes all settings

3. **database.py** - Database Connection
   - Connects to PostgreSQL
   - Creates session factory for database access
   - Provides `get_db()` dependency for routes

4. **models.py** - Database Models
   - Defines Invoice table (stores invoice data)
   - Defines InvoiceItem table (stores line items)
   - Uses SQLAlchemy ORM

5. **schemas.py** - Data Validation
   - Pydantic models for request/response
   - Validates data from frontend
   - Separates API structure from database structure

6. **crud.py** - Database Operations
   - Create: `create_invoice()`
   - Read: `get_invoice()`, `get_all_invoices()`
   - Update: `update_invoice()`
   - Delete: `delete_invoice()`

7. **routes.py** - API Endpoints
   - GET /api/invoices - List all invoices
   - POST /api/invoices - Create invoice
   - GET /api/invoices/{id} - Get single invoice
   - PUT /api/invoices/{id} - Update invoice
   - DELETE /api/invoices/{id} - Delete invoice

### Configuration Files

- **.env.example** - Template for environment variables
- **requirements.txt** - Python package dependencies
- **docker-compose.yml** - PostgreSQL container setup
- **.gitignore** - Files to exclude from git

## Setup Instructions

### Prerequisites

- Python 3.9+
- PostgreSQL 12+ (or Docker)
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Setup PostgreSQL

#### Option A: Using Docker (Recommended for beginners)

1. Install Docker from https://www.docker.com/products/docker-desktop

2. Start PostgreSQL container:
```bash
docker-compose up -d
```

3. Verify it's running:
```bash
docker-compose ps
```

#### Option B: Manual PostgreSQL Installation

1. Install PostgreSQL from https://www.postgresql.org/download/

2. Create database:
```bash
psql -U postgres
CREATE DATABASE invoice_generator;
\q
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` if using different credentials:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_generator
SECRET_KEY=your-super-secret-key
ENVIRONMENT=development
```

### Step 4: Run the Backend

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

Output should show:
```
Uvicorn running on http://127.0.0.1:8000
Press CTRL+C to quit
```

### Step 5: Verify it's Working

1. Open browser and go to: http://localhost:8000/health
   - Should return: `{"status": "ok"}`

2. Visit API documentation: http://localhost:8000/docs
   - Interactive Swagger UI - test endpoints here!

3. Visit alternative docs: http://localhost:8000/redoc

## Understanding the Flow

### Creating an Invoice (Example)

1. **Frontend** sends POST request:
```
POST /api/invoices
{
  "invoice_no": "INV-001",
  "date": "2024-01-15",
  "company_name": "Shubham Aluminium",
  ...
  "items": [
    {"description": "Aluminium Sheet", "qty": 10, "rate": 500}
  ]
}
```

2. **FastAPI** (in routes.py):
   - Validates data with Pydantic schema
   - Checks if invoice_no already exists
   - Calls `crud.create_invoice()`

3. **CRUD** (in crud.py):
   - Calculates subtotal, SGST, CGST, grand_total
   - Creates Invoice object
   - Creates InvoiceItem objects
   - Saves to database
   - Returns created invoice

4. **Database** (PostgreSQL):
   - Inserts row in `invoices` table
   - Inserts rows in `invoice_items` table
   - Auto-generates IDs

5. **Backend** returns response with created invoice (including ID)

6. **Frontend** receives response and updates UI

## API Endpoints

### List All Invoices
```
GET /api/invoices?skip=0&limit=10
```

### Get Single Invoice
```
GET /api/invoices/1
```

### Create Invoice
```
POST /api/invoices
{...invoice data...}
```

### Update Invoice
```
PUT /api/invoices/1
{...updated fields...}
```

### Delete Invoice
```
DELETE /api/invoices/1
```

## Key Python Concepts Used

### Decorators (@)
```python
@app.get("/invoices")  # This decorator marks function as API endpoint
def get_invoices():
    pass
```

### Type Hints
```python
def get_invoice(db: Session, invoice_id: int) -> Optional[Invoice]:
    # db must be Session
    # invoice_id must be int
    # Returns Optional[Invoice] (Invoice or None)
```

### Dependencies (FastAPI)
```python
def get_invoices(db: Session = Depends(get_db)):
    # Depends(get_db) automatically calls get_db() and passes result
```

### Context Managers (try/finally)
```python
def get_db():
    db = SessionLocal()
    try:
        yield db  # Provide database session
    finally:
        db.close()  # Always close, even if error occurs
```

## Common Tasks

### Adding a New Field to Invoice

1. **models.py**: Add column to Invoice class
   ```python
   new_field = Column(String(100))
   ```

2. **schemas.py**: Add to InvoiceBase, InvoiceCreate, Invoice
   ```python
   new_field: str
   ```

3. **crud.py**: Handle in create/update functions

4. **Database**: Will auto-create new column next time you run app

### Testing Endpoints

1. Go to http://localhost:8000/docs
2. Click on endpoint you want to test
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. See response

### Debugging

1. Set `echo=True` in database.py to see SQL queries:
   ```python
   engine = create_engine(settings.DATABASE_URL, echo=True)
   ```

2. Add print statements in crud.py:
   ```python
   print(f"Creating invoice: {invoice.invoice_no}")
   ```

3. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

## Security Notes

- Change SECRET_KEY in .env before production
- Use strong database password
- Don't commit `.env` file
- Use HTTPS in production
- Validate all user input (Pydantic does this)

## Connecting Frontend to Backend

In your React component:

```typescript
const response = await fetch('http://localhost:8000/api/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(invoiceData)
});
const createdInvoice = await response.json();
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

### Database Connection Error
- Check DATABASE_URL in .env
- Verify PostgreSQL is running: `docker-compose ps`
- Check PostgreSQL logs: `docker-compose logs postgres`

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## Next Steps

1. Test all endpoints at http://localhost:8000/docs
2. Integrate frontend to call these endpoints
3. Add authentication (JWT tokens)
4. Add more validations
5. Deploy to production
