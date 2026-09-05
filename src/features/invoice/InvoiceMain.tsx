import { useState, type ChangeEvent } from 'react'
import { ToWords } from 'to-words'
import { Button } from '../../components/Button'
import { invoiceEnums, mockEmpty, type InvoiceData, type InvoiceItem } from './enums'
import styles from './InvoiceMain.module.scss'

const toWords = new ToWords()

export default function InvoiceMain() {
  const {
    mainHeroHeader,
    ownAddress,
    gstTitle,
    gstvalue,
    invoiceTitle,
    date,
    mobileTitle,
    mobileNumber,
  } = invoiceEnums
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(mockEmpty)

  const handleItemChange = (
    index: number,
    key: keyof InvoiceItem,
    value: string,
  ) => {
    const updatedItems = [...invoiceData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: key === 'qty' || key === 'rate' ? parseFloat(value) || 0 : value,
    }
    setInvoiceData({ ...invoiceData, items: updatedItems })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleAddRow = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', hsn: '', qty: 0, rate: 0 }],
    })
  }

  const handleRemoveRow = (index: number) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index)
    setInvoiceData({ ...invoiceData, items: updatedItems })
  }

  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.qty * item.rate,
    0,
  )
  const sgst = subtotal * 0.09
  const cgst = subtotal * 0.09
  const grandTotal = subtotal + sgst + cgst

  return (
    <div className={styles.invoice}>
      <div className={styles.invoice__header}>
        <h1>{mainHeroHeader}</h1>
        <p>{ownAddress}</p>
        <p>
          <strong>{gstTitle}</strong>
          {gstvalue}
        </p>
        <p>
          <strong>{mobileTitle}</strong>
          {mobileNumber}
        </p>
        <p>
          {invoiceTitle}
          <input
            value={invoiceData.invoiceNo}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })
            }
          />
          {' '} | <strong> {date}</strong>
          <input
            type="date"
            value={invoiceData.date}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInvoiceData({ ...invoiceData, date: e.target.value })
            }
          />
        </p>
      </div>

      <div className={styles.invoice__address}>
        <div className={styles.invoice__field}>
          <strong>M/s:</strong>
          <input
            value={invoiceData.client.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, name: e.target.value } })
            }
          />
        </div>
        <div className={styles.invoice__field}>
          <strong>Address:</strong>
          <textarea
            value={invoiceData.client.address}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, address: e.target.value } })
            }
          />
        </div>
        <div className={styles.invoice__field}>
          <strong>GSTIN:</strong>
          <input
            value={invoiceData.client.gstin}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, gstin: e.target.value } })
            }
          />
        </div>
        <div className={styles.invoice__field}>
          <strong>WO No:</strong>
          <input
            value={invoiceData.client.workOrder}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, workOrder: e.target.value } })
            }
          />
        </div>
      </div>

      <table className={styles.invoice__table}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Description of Goods</th>
            <th>HSN/SAC</th>
            <th>Qty</th>
            <th>Rate</th>
            <th className={styles['invoice__table-total-header']}>Total Taxable Value (₹)</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <textarea
                  value={item.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleItemChange(index, 'description', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  className={styles['invoice__hsn-qty-rate']}
                  value={item.hsn}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(index, 'hsn', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  className={styles['invoice__hsn-qty-rate']}
                  value={item.qty}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(index, 'qty', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  className={styles['invoice__hsn-qty-rate']}
                  type="number"
                  step="0.01"
                  value={item.rate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(index, 'rate', e.target.value)
                  }
                />
              </td>
              <td>{(item.qty * item.rate).toFixed(2)}</td>
              <td className="u-no-print">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRow(index)}
                  aria-label="Remove row"
                >
                  ❌
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`${styles.invoice__actions} u-no-print`}>
        <Button type="button" variant="secondary" onClick={handleAddRow}>
          + Add New Row
        </Button>
      </div>
      <div className={styles.invoice__summary}>
        <p>
          <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
        </p>
        <p>SGST @9%: ₹{sgst.toFixed(2)}</p>
        <p>CGST @9%: ₹{cgst.toFixed(2)}</p>
        <p className={styles['invoice__summary-total']}>Grand Total: ₹{grandTotal.toFixed(2)}</p>
        <p className={styles['invoice__summary-words']}>
          (In Words: {toWords.convert(Number(grandTotal.toFixed(2)), { currency: true })})
        </p>
      </div>

      <div className={styles.invoice__footer}>
        <div className={styles['invoice__bank-details']}>
          <p>
            <strong>Bank Details for Payment:</strong>
          </p>
          <strong>Branch Name:{' '}</strong>
          <span>{invoiceData.bank.details}</span>
          <p className={styles['invoice__bank-ac-ifsc']}>
            <strong>A/C No:{' '}</strong> <span>{invoiceData.bank.account}</span>{' '}
            <strong>& IFSC:{' '}</strong>
            <span>{invoiceData.bank.ifsc}</span>
          </p>
        </div>
        <div className={styles.invoice__signature}>
          <p>
            For, <strong>{invoiceData.companyName}</strong>
          </p>
          <p className={styles['invoice__signature-line']}>(Authorised Signatory)</p>
        </div>
      </div>

      <div className={`${styles.invoice__actions} u-no-print`}>
        <Button type="button" variant="primary" onClick={handlePrint}>
          Print / Download PDF
        </Button>
      </div>
    </div>
  )
}
