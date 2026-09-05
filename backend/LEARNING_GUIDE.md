# FastAPI + PostgreSQL - Beginner's Learning Guide

This guide explains all the concepts and why each part exists.

## What is an API?

**API = Application Programming Interface**

Think of it like a restaurant:
- **Frontend** = Customer placing order
- **Backend/API** = Chef and kitchen
- **Database** = Storage and ingredients

Customer → Menu (API docs) → Place order → Chef processes → Returns dish

In our case:
- Customer = React app in browser
- Menu = http://localhost:8000/docs
- Order = HTTP request (GET, POST, PUT, DELETE)
- Chef = FastAPI processing the request
- Database = PostgreSQL storing data

## Why Separate Frontend and Backend?

### Frontend-Only (What you had before)
- Data stored in browser memory
- Refresh page = data lost
- Can't access from another device

### Frontend + Backend (What we're building)
- Data stored in database
- Persists forever (until deleted)
- Access from any device
- Multiple users can work simultaneously

## Core Technologies Explained

### 1. FastAPI (Python Web Framework)

**What it does**: Receives HTTP requests and sends responses

```
Request: GET /api/invoices
         ↓
FastAPI: Routes to correct function
         ↓
Function: Processes request
         ↓
Database: Fetches data
         ↓
Response: Sends invoices back as JSON
```

**Why FastAPI?**
- Modern, fast, easy to learn
- Built-in data validation (Pydantic)
- Auto-generated API documentation
- Great for beginners

### 2. PostgreSQL (Database)

**What it does**: Stores data permanently

Think of it like an organized filing cabinet:
```
Invoices Table (like an Excel sheet):
ID  | Invoice No | Date       | Client        | Total
----|------------|------------|---------------|--------
1   | INV-001    | 2024-01-15 | ABC Corp      | 50000
2   | INV-002    | 2024-01-16 | XYZ Industries| 75000

InvoiceItems Table:
ID  | Invoice_ID | Description      | Qty | Rate
----|------------|------------------|-----|------
1   | 1          | Aluminium Sheet  | 10  | 500
2   | 1          | Aluminium Bar    | 5   | 1000
```

**Why PostgreSQL?**
- Relational (tables with relationships)
- Reliable and battle-tested
- Free and open-source
- Great for structured data

### 3. SQLAlchemy (ORM - Object Relational Mapping)

**What it does**: Translates Python objects to database operations

```python
# Instead of writing SQL:
# SELECT * FROM invoices WHERE id = 1

# You write Python:
invoice = db.query(Invoice).filter(Invoice.id == 1).first()

# SQLAlchemy converts to SQL automatically
```

**Why ORM?**
- Safer (prevents SQL injection attacks)
- Cleaner code
- Less error-prone
- Database independent (easier to switch databases)

### 4. Pydantic (Data Validation)

**What it does**: Validates that data matches expected format

```python
# If frontend sends:
{
    "invoice_no": "INV-001",      ✓ Valid (string)
    "qty": 10,                     ✓ Valid (number)
}

# But API expects invoice_no to be a string and rate to be float
# Pydantic validates and converts types automatically

# If frontend sends invalid data:
{
    "invoice_no": 123,             ✗ Wrong type (number, should be string)
    "rate": "expensive"            ✗ Wrong type (string, should be number)
}

# Pydantic rejects it with clear error message
```

**Why Pydantic?**
- Prevents bad data from entering system
- Auto-converts types when possible
- Provides clear error messages
- Generates API documentation

## File-by-File Breakdown

### **config.py** - Settings Management

```python
class Settings(BaseSettings):
    DATABASE_URL: str = "..."
    SECRET_KEY: str = "..."
    ENVIRONMENT: str = "development"
```

**Why needed:**
- Centralized configuration
- Secrets not hardcoded in source
- Different settings for dev vs production
- Environment-specific behavior

**Key concept - Pydantic BaseSettings:**
- Automatically reads from .env file
- Type-checks variables
- Provides defaults

### **database.py** - Database Connection

```python
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Why needed:**
- Single place to configure database connection
- Reusable session management
- Automatic cleanup (closes connections)

**Key concepts:**
- **Engine**: Connection pool to database
- **SessionLocal**: Creates new database sessions
- **get_db()**: FastAPI dependency that provides session to routes

**Why generator function (yield)?**
- Ensures connection always closes
- Even if error occurs, finally block runs
- Like a context manager (with statement)

### **models.py** - Database Tables

```python
class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    invoice_no = Column(String(50), unique=True)
    # ... more columns
```

**Why needed:**
- Defines table structure
- SQLAlchemy creates actual tables from these
- Type safety (Python checks types)

**Key concepts:**
- **Primary Key**: Unique identifier for each row
- **Foreign Key**: Links to another table
- **Relationships**: Python representation of database relationships

### **schemas.py** - API Data Format

```python
class InvoiceCreate(BaseModel):
    invoice_no: str
    date: str
    items: List[InvoiceItemCreate]

class Invoice(BaseModel):
    id: int  # Only in response, not in create
    invoice_no: str
    items: List[InvoiceItem]
```

**Why separate from models.py?**
- Frontend doesn't need database structure
- API can return less/more data than stored
- Cleaner separation of concerns
- Can change database without changing API

**Key concepts:**
- **BaseModel**: Pydantic class (validates data)
- **Optional**: Field can be None
- **List**: Array of items
- **from_attributes**: Convert database model to Pydantic model

### **crud.py** - Database Operations

```python
def create_invoice(db: Session, invoice: InvoiceCreate):
    # 1. Prepare data
    # 2. Validate
    # 3. Create objects
    # 4. Save to database
    # 5. Return result

def get_invoice(db: Session, invoice_id: int):
    # Query database
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def update_invoice(db: Session, invoice_id: int, invoice_update: InvoiceUpdate):
    # Find existing record
    # Update fields
    # Save changes
    # Return updated record

def delete_invoice(db: Session, invoice_id: int):
    # Find record
    # Delete it
    # Commit change
```

**Why needed:**
- Reusable database logic
- Clean separation from routes
- If 2 endpoints need same operation, don't duplicate

**Key SQL concepts:**
- **Query**: SELECT statement
- **Filter**: WHERE clause
- **First()**: Get one result
- **All()**: Get all results
- **Add()**: Insert new record
- **Delete()**: Remove record
- **Commit()**: Save changes

### **routes.py** - API Endpoints

```python
@app.get("/api/invoices")
def get_invoices(db: Session = Depends(get_db)):
    return crud.get_all_invoices(db)

@app.post("/api/invoices")
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    return crud.create_invoice(db, invoice)

@app.put("/api/invoices/{invoice_id}")
def update_invoice(invoice_id: int, invoice_update: InvoiceUpdate, db: Session = Depends(get_db)):
    return crud.update_invoice(db, invoice_id, invoice_update)

@app.delete("/api/invoices/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    return crud.delete_invoice(db, invoice_id)
```

**Why needed:**
- Define what endpoints exist
- Route requests to correct functions
- HTTP methods (GET, POST, PUT, DELETE)

**Key concepts:**
- **@app.get()**: Handle GET requests
- **@app.post()**: Handle POST requests
- **Path parameter**: `/invoices/{invoice_id}` - extracted from URL
- **Depends(get_db)**: Inject database session
- **Request body**: `InvoiceCreate` - validated automatically
- **Response model**: `Invoice` - format what's returned

### **main.py** - Application Entry Point

```python
Base.metadata.create_all(bind=engine)  # Create tables

app = FastAPI()  # Create app

app.add_middleware(CORSMiddleware, ...)  # Allow frontend to call

app.include_router(router)  # Add routes

if __name__ == "__main__":
    uvicorn.run("main:app", ...)  # Start server
```

**Why needed:**
- Brings everything together
- Configures CORS (allows frontend to communicate)
- Creates tables on startup
- Starts the server

**Key concepts:**
- **CORS (Cross-Origin Resource Sharing)**:
  - Browser blocks cross-origin requests for security
  - CORS tells browser: "These services trust each other"
  - Middleware: Software that processes all requests

## The Flow: Creating an Invoice

### Step 1: Frontend Sends Request
```javascript
// In React
const response = await fetch('http://localhost:8000/api/invoices', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    invoice_no: 'INV-001',
    date: '2024-01-15',
    items: [...]
  })
});
```

### Step 2: FastAPI Receives Request
```
Browser → HTTP request → Network → FastAPI app
```

### Step 3: Pydantic Validates
```python
# FastAPI sees: POST /api/invoices with JSON body
# Pydantic schema (InvoiceCreate) validates:
# - invoice_no is string ✓
# - date is string ✓
# - items is list of InvoiceItemCreate ✓
# If anything wrong, returns 422 error
```

### Step 4: Route Handler Processes
```python
@app.post("/api/invoices")
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    # invoice = validated data
    # db = database session from get_db()
    return crud.create_invoice(db, invoice)
```

### Step 5: CRUD Creates Record
```python
def create_invoice(db, invoice):
    # Calculate amounts
    subtotal = sum(item.qty * item.rate for item in invoice.items)
    sgst = subtotal * 0.09
    cgst = subtotal * 0.09
    grand_total = subtotal + sgst + cgst
    
    # Create Invoice object
    db_invoice = Invoice(
        invoice_no=invoice.invoice_no,
        date=invoice.date,
        subtotal=subtotal,
        # ... more fields
    )
    
    # Add items
    for item in invoice.items:
        db_item = InvoiceItem(...)
        db_invoice.items.append(db_item)
    
    # Save to database
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice
```

### Step 6: Database Saves Data
```sql
-- SQLAlchemy generates:
INSERT INTO invoices (invoice_no, date, subtotal, sgst, cgst, grand_total, ...)
VALUES ('INV-001', '2024-01-15', 50000, 4500, 4500, 59000, ...);

INSERT INTO invoice_items (invoice_id, description, hsn, qty, rate)
VALUES (1, 'Aluminium Sheet', '7606', 10, 500);
-- ... more items
```

### Step 7: Backend Returns Response
```python
# The created invoice (with auto-generated ID) is returned
# Pydantic schema (Invoice) formats the response
# Converts to JSON
return {
    "id": 1,
    "invoice_no": "INV-001",
    "date": "2024-01-15",
    "subtotal": 50000,
    "sgst": 4500,
    "cgst": 4500,
    "grand_total": 59000,
    "items": [...]
}
```

### Step 8: Frontend Receives Response
```javascript
const data = await response.json();
console.log(data);
// {id: 1, invoice_no: "INV-001", ...}
// Update UI with new invoice
```

## Why This Architecture?

### Separation of Concerns
- Frontend: UI/UX
- Backend: Business logic
- Database: Data storage
- Each can be updated independently

### Scalability
- Multiple frontends can use same backend
- Backend can handle many requests
- Database optimized for storage

### Security
- Database hidden from internet
- Only API exposed
- Can add authentication layer
- Validate all inputs

### Maintainability
- Clear structure
- Easy to add features
- Easy to test
- Easy to debug

## Common Beginner Questions

### Q: What if I refresh the page?
A: Data persists in database. Frontend fetches it again. ✓

### Q: How do multiple users see same data?
A: All fetch from same database. Database syncs across clients. ✓

### Q: Where is data actually stored?
A: PostgreSQL database on disk (or Docker container). ✓

### Q: What's the JSON I see in responses?
A: Pydantic converts Python objects to JSON. JSON is universal format. ✓

### Q: How does frontend know invoice was created?
A: API returns response with new invoice (including auto-generated ID). ✓

### Q: Can I delete an invoice?
A: Yes, DELETE /api/invoices/1 calls delete_invoice(). Cascade deletes items too. ✓

## Next Steps to Learn

1. **Test the API**: Go to http://localhost:8000/docs
   - Try creating an invoice
   - Try updating it
   - Try deleting it
   - See how data changes in database

2. **Add logging**: Print debug info
   - See what's happening at each step
   - Understand the flow

3. **Add more features**: 
   - Filter invoices by date
   - Search by client name
   - Export to PDF

4. **Add authentication**:
   - User login
   - Protect endpoints
   - Only see your own invoices

5. **Deploy**:
   - Put on internet
   - Real database hosting
   - Real frontend hosting

## Debugging Tips

1. **Check API docs**: http://localhost:8000/docs
2. **Enable SQL logging**:
   ```python
   # In database.py, change:
   engine = create_engine(settings.DATABASE_URL, echo=True)
   ```
3. **Print debug info**:
   ```python
   print(f"Invoice: {invoice}")
   print(f"Items: {invoice.items}")
   ```
4. **Check database directly**:
   ```bash
   docker exec -it invoice_generator_db psql -U postgres -d invoice_generator
   SELECT * FROM invoices;
   ```
5. **Read error messages carefully**:
   - They tell you exactly what's wrong
   - Google the error (95% someone else had it)

## Security Best Practices

1. **Never commit .env**: Add to .gitignore ✓ (already done)
2. **Change SECRET_KEY**: Before going to production
3. **Validate all input**: Pydantic does this ✓
4. **Secure your database**: Password protect
5. **Use HTTPS**: In production
6. **Add authentication**: Don't let anyone create invoices

## Learning Resources

- FastAPI docs: https://fastapi.tiangolo.com/
- SQLAlchemy docs: https://docs.sqlalchemy.org/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Pydantic docs: https://docs.pydantic.dev/
- Python docs: https://docs.python.org/3/

---

**You now understand:**
- What a backend is and why it's needed
- How FastAPI routes requests
- How Pydantic validates data
- How SQLAlchemy ORM works
- How PostgreSQL stores data
- How all parts work together

**Next: Follow the README.md to set up and run the backend!**
