import { IOffer } from "./loyalty";

export interface ISiteResponse {
  item?: ISite;
  message?: string;
}

export interface ISite {
  id?: string;
  businessId?: string;
  userId?: string;
  name: string;
  buildingNo?: string;
  postcode: string;
  country?: string;
  countryCode?: string;
  city: string;
  w3w?: string;
  status?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  timeZoneDBName?: string;
  tillSystemName?: string;
  customTillSystemName?: string;
  createdAt?: string;
  imageURL?: string;
  offers?: IOffer[];
}
