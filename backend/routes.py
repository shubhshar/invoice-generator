"""
API Routes (Endpoints)

Defines all HTTP endpoints that the frontend can call.

Routing pattern:
- GET /api/invoices → Get all invoices
- POST /api/invoices → Create invoice
- GET /api/invoices/{id} → Get single invoice
- PUT /api/invoices/{id} → Update invoice
- DELETE /api/invoices/{id} → Delete invoice
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
from schemas import InvoiceCreate, InvoiceUpdate, Invoice, InvoiceList
from typing import List

# Create a router object
# APIRouter allows organizing routes in separate files
# We'll include this router in main.py
router = APIRouter(
    prefix="/api/invoices",  # All routes here start with /api/invoices
    tags=["invoices"]  # Grouping in API documentation
)


# ==================== GET ENDPOINTS ====================

@router.get("", response_model=List[InvoiceList])
def get_invoices(
    skip: int = 0,  # Query parameter: how many to skip
    limit: int = 100,  # Query parameter: max to return
    db: Session = Depends(get_db)  # Dependency: inject database session
):
    """
    Get all invoices with pagination

    Query Parameters:
    - skip: Number of invoices to skip (default: 0)
    - limit: Maximum invoices to return (default: 100)

    Returns:
    List of invoices (simplified version)

    Example Request:
    GET http://localhost:8000/api/invoices?skip=0&limit=10

    Example Response:
    [
        {
            "id": 1,
            "invoice_no": "INV-001",
            "date": "2024-01-15",
            "client_name": "ABC Corporation",
            "grand_total": 50000.0,
            "created_at": "2024-01-15T10:00:00"
        }
    ]
    """
    invoices = crud.get_all_invoices(db, skip=skip, limit=limit)
    return invoices


@router.get("/{invoice_id}", response_model=Invoice)
def get_invoice(
    invoice_id: int,  # Path parameter: extracted from URL
    db: Session = Depends(get_db)
):
    """
    Get a single invoice by ID

    Path Parameters:
    - invoice_id: Invoice ID

    Returns:
    Complete invoice with all details and items

    Example Request:
    GET http://localhost:8000/api/invoices/1

    Example Response:
    {
        "id": 1,
        "invoice_no": "INV-001",
        "date": "2024-01-15",
        "company_name": "Shubham Aluminium",
        ...
        "items": [
            {
                "id": 1,
                "invoice_id": 1,
                "description": "Aluminium Sheet",
                "hsn": "7606",
                "qty": 10,
                "rate": 500.0
            }
        ]
    }
    """
    db_invoice = crud.get_invoice(db, invoice_id)
    if not db_invoice:
        # Return 404 error if not found
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice


# ==================== POST ENDPOINT ====================

@router.post("", response_model=Invoice)
def create_invoice(
    invoice: InvoiceCreate,  # Request body: automatic validation by Pydantic
    db: Session = Depends(get_db)
):
    """
    Create a new invoice

    Request Body:
    InvoiceCreate schema with all details and items

    Returns:
    Created invoice with ID and calculated amounts

    Example Request:
    POST http://localhost:8000/api/invoices
    {
        "invoice_no": "INV-001",
        "date": "2024-01-15",
        "company_name": "Shubham Aluminium",
        "company_address": "...",
        ...
        "items": [
            {
                "description": "Aluminium Sheet",
                "hsn": "7606",
                "qty": 10,
                "rate": 500.0
            }
        ]
    }

    The API will:
    1. Validate the data (Pydantic)
    2. Check invoice_no is unique
    3. Calculate subtotal, SGST, CGST, grand_total
    4. Save to database
    5. Return the created invoice
    """
    # Check if invoice_no already exists
    db_invoice = crud.get_invoice_by_number(db, invoice.invoice_no)
    if db_invoice:
        # Return 400 error if duplicate
        raise HTTPException(
            status_code=400,
            detail="Invoice number already exists"
        )

    return crud.create_invoice(db, invoice)


# ==================== PUT ENDPOINT ====================

@router.put("/{invoice_id}", response_model=Invoice)
def update_invoice(
    invoice_id: int,  # Path parameter
    invoice_update: InvoiceUpdate,  # Request body
    db: Session = Depends(get_db)
):
    """
    Update an existing invoice

    Path Parameters:
    - invoice_id: Invoice ID to update

    Request Body:
    InvoiceUpdate schema (only changed fields required)

    Returns:
    Updated invoice

    Example Request:
    PUT http://localhost:8000/api/invoices/1
    {
        "client_name": "New Client Name"
    }

    Note:
    - Only provide fields you want to change
    - Items can be updated, old items will be replaced
    - Amounts are recalculated automatically
    """
    db_invoice = crud.update_invoice(db, invoice_id, invoice_update)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice


# ==================== DELETE ENDPOINT ====================

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,  # Path parameter
    db: Session = Depends(get_db)
):
    """
    Delete an invoice

    Path Parameters:
    - invoice_id: Invoice ID to delete

    Returns:
    Success message

    Example Request:
    DELETE http://localhost:8000/api/invoices/1

    Example Response:
    {
        "message": "Invoice deleted successfully"
    }

    Note:
    This also deletes all items for this invoice (cascade delete).
    """
    success = crud.delete_invoice(db, invoice_id)
    if not success:
        raise HTTPException(status_code=404, detail="Invoice not found")

    return {"message": "Invoice deleted successfully"}
