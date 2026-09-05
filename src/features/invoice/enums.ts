export interface InvoiceEnums {
  mainHeroHeader: string
  ownAddress: string
  gstTitle: string
  gstvalue: string
  invoiceTitle: string
  date: string
  mobileTitle: string
  mobileNumber: string
}

export const invoiceEnums: InvoiceEnums = {
  mainHeroHeader: 'Shubham Aluminium',
  ownAddress: 'Ram Nagar, Gokul Nagar, Disha College Road, Raipur (C.G.)',
  gstTitle: 'GSTIN No.:',
  gstvalue: '22CPIPS7530E1ZX',
  invoiceTitle: 'Invoice No.: ',
  date: 'Date: ',
  mobileTitle: 'Mob No.: ',
  mobileNumber: '7024443229',
}

export interface InvoiceItem {
  description: string
  hsn: string
  qty: number
  rate: number
}

export interface InvoiceClient {
  name: string
  address: string
  gstin: string
  workOrder: string
}

export interface InvoiceBankDetails {
  details: string
  account: string
  ifsc: string
}

export interface InvoiceData {
  companyName: string
  address: string
  gstin: string
  invoiceNo: string
  date: string
  client: InvoiceClient
  items: InvoiceItem[]
  bank: InvoiceBankDetails
}

export const mockEmpty: InvoiceData = {
  companyName: 'Shubham Aluminium',
  address: 'Ram Nagar, Gokul Nagar, Disha College Road, Raipur (C.G.)',
  gstin: '22CPIPS7530E1ZX',
  invoiceNo: '',
  date: '',
  client: {
    name: '',
    address: '',
    gstin: '',
    workOrder: '',
  },
  items: [
    {
      description: '',
      hsn: '',
      qty: 0,
      rate: 0,
    },
  ],
  bank: {
    details: 'Bank of Baroda, Tatibandh, Raipur',
    account: '39170400000130',
    ifsc: 'BARBOTATIBA',
  },
}
