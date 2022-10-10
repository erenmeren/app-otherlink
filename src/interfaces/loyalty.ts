export interface ILoyaltiesResponse {
  items?: ILoyalty[];
  status?: "idle" | "loading" | "failed";
  message?: string;
}

export interface ILoyaltyResponse {
  item?: ILoyalty;
  status?: "idle" | "loading" | "failed";
  message?: string;
}

export interface ILoyalty {
  siteId: string;
  siteName: string;
  numberOfVisit: number;
  offers?: IOffer[];
}

export interface IOffer {
  id: string;
  name: string;
  numberOfVisit: number;
  status: string;
}

// {
//  userId     : string;
//  siteId     : string;
//  offerId    : string; for request claim offer
//  documentId : string;
//  visitNumber: number;
//  offers     : {};
//  siteName   : string
// }
