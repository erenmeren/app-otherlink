export interface IDocumentResponse {
  item?: IDocument;
  status?: "idle" | "loading" | "failed";
  message?: string;
}

export interface IDocumentsResponse {
  items?: IDocument[];
  status?: "idle" | "loading" | "failed";
  message?: string;
}

export interface IDocument {
  id?: string;
  type?: string;
  receiptInfo?: IReceiptInfo;
  loyaltyStatus?: string;
  endUserId?: string;
  createdAt?: string;
}

interface IReceiptInfo {
  siteName?: string;
  totalPrice?: string;
  point?: string;
  priceArea?: string[];
  dateArea?: string[];
  itemsArea?: string[];
  paymentType?: string[];
  bottomArea?: string[];
  items?: IItem[];
  datetime?: string;
  receiptNo?: string;
}

interface IItem {
  name: string;
  quantity: number;
  price: number;
}

// export interface IDocument {
//   id?: string;

//   deviceId?: string;
//   businessId?: string;
//   retailerUserId?: string;
//   siteId?: string;

//   type?: string;

//   createdAt?: string;
// }
