"""
Database Models (Tables)

These classes represent database tables.
SQLAlchemy converts these into SQL CREATE TABLE statements.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Invoice(Base):
    """
    Invoice Table

    Stores all invoice information.
    Each invoice can have multiple items (line items).

    Columns explanation:
    - id: Primary key (unique identifier for each invoice)
    - invoice_no: Invoice number (must be unique across all invoices)
    - date: Date in string format (YYYY-MM-DD)
    - company_*: Your company's details
    - client_*: Customer's details
    - subtotal/sgst/cgst/grand_total: Calculated amounts
    - bank_*: Payment details
    - created_at/updated_at: Timestamps for tracking
    """

    __tablename__ = "invoices"  # This becomes the table name in PostgreSQL

    # Primary Key: Unique identifier, auto-incremented
    id = Column(Integer, primary_key=True, index=True)

    # Invoice Details
    invoice_no = Column(String(50), unique=True, index=True)  # Must be unique, indexed for fast lookup
    date = Column(String(10))  # Format: YYYY-MM-DD

    # Company Details (Your company info)
    company_name = Column(String(255))  # Max 255 characters
    company_address = Column(Text)  # Text allows longer strings
    company_gstin = Column(String(20))

    # Client Details (Customer info)
    client_name = Column(String(255))
    client_address = Column(Text)
    client_gstin = Column(String(20))
    client_work_order = Column(String(100))

    # Amounts
    subtotal = Column(Float, default=0.0)  # Float = decimal numbers
    sgst = Column(Float, default=0.0)
    cgst = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)

    # Bank Details for Payment
    bank_details = Column(String(255))
    bank_account = Column(String(50))
    bank_ifsc = Column(String(20))

    # Timestamps: When invoice was created and last updated
    # server_default=func.now(): Database sets this automatically
    # onupdate=func.now(): Database updates this automatically when record changes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to InvoiceItem
    # This allows you to do: invoice.items to get all items for this invoice
    # cascade="all, delete-orphan": If invoice deleted, delete its items too
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    """
    Invoice Item Table (Line Items)

    Each row represents one line item in an invoice.
    Multiple items belong to one invoice (1-to-Many relationship).

    Example:
    Invoice #001 has 3 items:
    - Item 1: Aluminium Sheet, HSN 123, Qty 10, Rate 500
    - Item 2: Aluminium Bar, HSN 124, Qty 5, Rate 1000
    - Item 3: Aluminium Plate, HSN 125, Qty 2, Rate 2000
    """

    __tablename__ = "invoice_items"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key: Links to Invoice table
    # ForeignKey("invoices.id"): This item belongs to an invoice
    # If invoice with this ID doesn't exist, it will fail
    # index=True: Speeds up queries like "find all items for invoice 5"
    invoice_id = Column(Integer, ForeignKey("invoices.id"), index=True)

    # Item Details
    description = Column(Text)  # Description of goods/services
    hsn = Column(String(20))  # HSN/SAC code
    qty = Column(Float)  # Quantity
    rate = Column(Float)  # Price per unit

    # Relationship back to Invoice
    # This allows you to do: item.invoice to get the parent invoice
    invoice = relationship("Invoice", back_populates="items")
