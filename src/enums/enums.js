export const invoiceEnums = {
    mainHeroHeader : "Shubham Aluminium",
    ownAddress : "Ram Nagar, Gokul Nagar, Disha College Road, Raipur (C.G.)",
    gstTitle:"GSTIN No.:",
    gstvalue:"22CPIPS7530E1ZX",
    invoiceTitle: "Invoice No.: ",
    date:"Date: "
}

export const mockData = {
    companyName: "Shubham Aluminium",
    address: "Ram Nagar, Gokul Nagar, Disha College Road, Raipur (C.G.)",
    gstin: "22CPIPS7530E1ZX",
    invoiceNo: "13",
    date: "2022-03-31",
    client: {
      name: "JSW ISPAT SPECIAL PRODUCTS LIMITED",
      address: "Village Kurud, Chandkhuri Marg, Mandir Hasaud, Raipur (C.G.)",
      gstin: "22AAACM0501D2ZT",
      workOrder: "WOR21-01015"
    },
    items: [
      {
        description: "Installation of ceiling & wall at our site control panel of furnace No. 03 SMS II Division",
        hsn: "9987",
        qty: 42.237,
        rate: 6293
      },
      {
        description: "Installation of door ionized with frame 2mm thick, section 4*3 at control panel of furnace No. 03 SMS II Division",
        hsn: "9987",
        qty: 2.10,
        rate: 7154
      },
      {
        description: "Installation of Godrej make door closure at control panel room furnace No. 03 SMS-II Division",
        hsn: "9987",
        qty: 2,
        rate: 2000
      }
    ],
    bank: {
      details: "Bank of Baroda, Tatibandh, Raipur",
      account: "3917040000130",
      ifsc: "BARB0TATIBA"
    }
  }



  export const mockEmpty = {
    companyName: "Shubham Aluminium",
    address: "Ram Nagar, Gokul Nagar, Disha College Road, Raipur (C.G.)",
    gstin: "22CPIPS7530E1ZX",
    invoiceNo: "",
    date: "",
    client: {
      name: "",
      address: "",
      gstin: "",
      workOrder: ""
    },
    items: [
      {
        description: "",
        hsn: "",
        qty: 0,
        rate: 0
      },
      {
        description: "",
        hsn: "",
        qty: 0,
        rate: 0
      },
      {
        description: "",
        hsn: "",
        qty: 0,
        rate: 0
      }
    ],
    bank: {
      details: "",
      account: "",
      ifsc: ""
    }
  }