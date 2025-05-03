import React, { useState } from "react";
import "./InvoiceMain.css";
import { invoiceEnums, mockEmpty } from "../../enums/enums";

export default function Invoice() {
    const { mainHeroHeader, ownAddress, gstTitle, gstvalue, invoiceTitle, date } = invoiceEnums
    const [invoiceData, setInvoiceData] = useState(mockEmpty);

    const handleItemChange = (index, key, value) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index][key] = key === "qty" || key === "rate" ? parseFloat(value) || 0 : value;
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleAddRow = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...invoiceData.items, { description: "", hsn: "", qty: "", rate: "" }],
        });
    };

    const handleRemoveRow = (index) => {
        const updatedItems = invoiceData.items.filter((_, i) => i !== index);
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    const subtotal = invoiceData.items.reduce(
        (acc, item) => acc + item.qty * item.rate,
        0
    );
    const sgst = subtotal * 0.09;
    const cgst = subtotal * 0.09;
    const grandTotal = subtotal + sgst + cgst;

    return (
        <div className="invoice-container">
            <div className="invoice-header">
                <h1>{mainHeroHeader}</h1>
                <p>{ownAddress}</p>
                <p><span>{gstTitle}</span>{gstvalue}</p>
                <p>
                    {invoiceTitle}
                    <input
                        value={invoiceData.invoiceNo}
                        onChange={(e) =>
                            setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })
                        }
                    />
                    <span className="print-only">{invoiceData.invoiceNo}</span>
                    {" "} | <strong> {date}</strong>
                    <input
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) =>
                            setInvoiceData({ ...invoiceData, date: e.target.value })
                        }
                    />
                    <span className="print-only">{invoiceData.date}</span>
                </p>
            </div>

            <div className="invoice-address">
                <p>
                    <strong>M/s:</strong>{" "}
                    <span className="field-wrapper">
                        <input
                            className="toClientName"
                            value={invoiceData.client.name}
                            onChange={(e) =>
                                setInvoiceData({
                                    ...invoiceData,
                                    client: { ...invoiceData.client, name: e.target.value }
                                })
                            }
                        />
                        <span className="print-only">{invoiceData.client.name}</span>
                    </span>
                </p>
                <div className="field-wrapper">
                    <strong>Address:</strong>{" "}

                    <textarea
                        className="addressTextArea"
                        rows="2"
                        value={invoiceData.client.address}
                        onChange={(e) =>
                            setInvoiceData({
                                ...invoiceData,
                                client: { ...invoiceData.client, address: e.target.value }
                            })
                        }
                    />
                    <span className="print-only" >{invoiceData.client.address}</span>
                </div>
                <p>
                    <span className="field-wrapper">
                        <strong> GSTIN:{" "}</strong>
                        <input
                            value={invoiceData.client.gstin}
                            onChange={(e) =>
                                setInvoiceData({
                                    ...invoiceData,
                                    client: { ...invoiceData.client, gstin: e.target.value }
                                })
                            }
                        />
                        <span className="print-only" >{invoiceData.client.gstin}</span>
                    </span>
                </p>
                <p>
                    <span className="field-wrapper">
                        <strong> WO No:{" "}</strong>
                        <input
                            value={invoiceData.client.workOrder}
                            onChange={(e) =>
                                setInvoiceData({
                                    ...invoiceData,
                                    client: { ...invoiceData.client, workOrder: e.target.value }
                                })
                            }
                        />
                        <span className="print-only" >{invoiceData.client.workOrder}</span>
                    </span>
                </p>
            </div>

            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Description of Goods</th>
                        <th>HSN/SAC</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td >
                                <textarea
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                />
                                <span className="print-only" >{item.description}</span>
                            </td>
                            <td >
                                <input
                                    className="hsn-qty-rate"
                                    value={item.hsn}
                                    onChange={(e) => handleItemChange(index, "hsn", e.target.value)}
                                />
                                <span className="print-only">{item.hsn}</span>
                            </td>
                            <td >
                                <input
                                    type="number"
                                    className="hsn-qty-rate"
                                    value={item.qty}
                                    onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                />
                                <span className="print-only">{item.qty}</span>
                            </td>
                            <td >
                                <input
                                    className="hsn-qty-rate"

                                    type="number"
                                    step="0.01"
                                    value={item.rate}
                                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                />
                                <span className="print-only">{item.rate}</span>
                            </td>
                            <td>{(item.qty * item.rate).toFixed(2)}</td>
                            <td className="no-print">
                                <button onClick={() => handleRemoveRow(index)}>❌</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <div className="no-print">
                <button onClick={handleAddRow}>➕ Add New Row</button>
            </div>
            <div className="invoice-summary">
                <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
                <p>SGST @9%: ₹{sgst.toFixed(2)}</p>
                <p>CGST @9%: ₹{cgst.toFixed(2)}</p>
                <p className="grand-total">Grand Total: ₹{grandTotal.toFixed(2)}</p>
                <p className="in-words">
                    (In Words: {/* Optionally convert to words here */})
                </p>
            </div>

            <div className="invoice-footer">
                <div className="bank-details">
                    <p><strong>Bank Details for Payment:</strong></p>
                    <input
                        className="bankBranchAddress"
                        type="text"
                        value={invoiceData.bank.details}
                        onChange={(e) =>
                            setInvoiceData({
                                ...invoiceData,
                                bank: { ...invoiceData.bank, details: e.target.value }
                            })
                        }
                    />
                    <p>
                        A/C No:{" "}
                        <input
                            value={invoiceData.bank.account}
                            onChange={(e) =>
                                setInvoiceData({
                                    ...invoiceData,
                                    bank: { ...invoiceData.bank, account: e.target.value }
                                })
                            }
                        />{" "}
                        | IFSC:{" "}
                        <input
                            value={invoiceData.bank.ifsc}
                            onChange={(e) =>
                                setInvoiceData({
                                    ...invoiceData,
                                    bank: { ...invoiceData.bank, ifsc: e.target.value }
                                })
                            }
                        />
                    </p>
                </div>
                <div className="signature">
                    <p>
                        For, <strong>{invoiceData.companyName}</strong>
                    </p>
                    <p className="authorised-sign">(Authorised Signatory)</p>
                </div>
            </div>

            <div className="print-button-container no-print">
                <button onClick={handlePrint} className="print-button">
                    Print / Download PDF
                </button>
            </div>
        </div>
    );
}
