"""
CRUD Operations (Create, Read, Update, Delete)

All database operations are here.
This keeps database logic separate from API routes.
"""

from sqlalchemy.orm import Session
from models import Invoice, InvoiceItem
from schemas import InvoiceCreate, InvoiceUpdate


# ==================== READ OPERATIONS ====================

def get_invoice(db: Session, invoice_id: int):
    """
    Get a single invoice by ID

    Args:
        db: Database session
        invoice_id: The invoice's ID

    Returns:
        Invoice object or None if not found

    Example:
        invoice = get_invoice(db, 1)
        print(invoice.invoice_no)  # Output: INV-001
    """
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()


def get_invoice_by_number(db: Session, invoice_no: str):
    """
    Get a single invoice by invoice number

    Args:
        db: Database session
        invoice_no: Invoice number (e.g., "INV-001")

    Returns:
        Invoice object or None if not found
    """
    return db.query(Invoice).filter(Invoice.invoice_no == invoice_no).first()


def get_all_invoices(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all invoices with pagination

    Args:
        db: Database session
        skip: How many to skip (for pagination)
        limit: Max number to return

    Returns:
        List of Invoice objects

    Example:
        # Get first 10 invoices
        invoices = get_all_invoices(db, skip=0, limit=10)
        # Get next 10 invoices
        invoices = get_all_invoices(db, skip=10, limit=10)
    """
    return db.query(Invoice).offset(skip).limit(limit).all()


# ==================== CREATE OPERATIONS ====================

def create_invoice(db: Session, invoice: InvoiceCreate):
    """
    Create a new invoice with items

    Args:
        db: Database session
        invoice: InvoiceCreate schema (data from frontend)

    Returns:
        Newly created Invoice object

    Process:
    1. Extract items from invoice data
    2. Create Invoice record without items
    3. Add items to database
    4. Commit all changes

    Example:
        invoice_data = InvoiceCreate(
            invoice_no="INV-001",
            date="2024-01-15",
            ...
            items=[...]
        )
        db_invoice = create_invoice(db, invoice_data)
    """
    # Extract items from the invoice data
    items_data = invoice.items
    # Create a copy of invoice data without items
    invoice_dict = invoice.model_dump(exclude={"items"})

    # Calculate amounts before saving
    subtotal = sum(item.qty * item.rate for item in items_data)
    sgst = subtotal * 0.09  # 9% SGST
    cgst = subtotal * 0.09  # 9% CGST
    grand_total = subtotal + sgst + cgst

    # Add calculated amounts to data
    invoice_dict["subtotal"] = subtotal
    invoice_dict["sgst"] = sgst
    invoice_dict["cgst"] = cgst
    invoice_dict["grand_total"] = grand_total

    # Create new Invoice object (not yet in database)
    db_invoice = Invoice(**invoice_dict)

    # Create InvoiceItem objects and add to invoice
    for item in items_data:
        db_item = InvoiceItem(**item.model_dump())
        db_invoice.items.append(db_item)

    # Add to database
    db.add(db_invoice)
    # Commit (save all changes)
    db.commit()
    # Refresh to get updated data from database (e.g., auto-generated ID)
    db.refresh(db_invoice)

    return db_invoice


# ==================== UPDATE OPERATIONS ====================

def update_invoice(db: Session, invoice_id: int, invoice_update: InvoiceUpdate):
    """
    Update an existing invoice

    Args:
        db: Database session
        invoice_id: ID of invoice to update
        invoice_update: Updated data (only changed fields)

    Returns:
        Updated Invoice object or None if not found

    Process:
    1. Find invoice in database
    2. Update only provided fields
    3. Recalculate amounts if items changed
    4. Commit changes

    Example:
        update_data = InvoiceUpdate(client_name="New Client")
        updated = update_invoice(db, 1, update_data)
    """
    # Find invoice in database
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        return None

    # Get data that needs updating
    update_data = invoice_update.model_dump(exclude_unset=True)

    # Handle items separately (they have special logic)
    items_data = update_data.pop("items", None)

    # Update regular fields
    for field, value in update_data.items():
        setattr(db_invoice, field, value)

    # Update items if provided
    if items_data is not None:
        # Delete old items
        for old_item in db_invoice.items:
            db.delete(old_item)
        # Add new items
        for item in items_data:
            db_item = InvoiceItem(**item.model_dump())
            db_invoice.items.append(db_item)

    # Recalculate amounts
    subtotal = sum(item.qty * item.rate for item in db_invoice.items)
    db_invoice.subtotal = subtotal
    db_invoice.sgst = subtotal * 0.09
    db_invoice.cgst = subtotal * 0.09
    db_invoice.grand_total = subtotal + db_invoice.sgst + db_invoice.cgst

    # Commit changes
    db.commit()
    db.refresh(db_invoice)

    return db_invoice


# ==================== DELETE OPERATIONS ====================

def delete_invoice(db: Session, invoice_id: int):
    """
    Delete an invoice (and its items, due to cascade)

    Args:
        db: Database session
        invoice_id: ID of invoice to delete

    Returns:
        True if deleted, False if not found

    Note:
        Due to cascade="all, delete-orphan" in models.py,
        deleting an invoice automatically deletes its items.
    """
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        return False

    db.delete(db_invoice)
    db.commit()
    return True
