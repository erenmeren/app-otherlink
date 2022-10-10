import { IDocument } from "./document";
import { ILoyalty } from "./loyalty";

export interface IUserInfoResponse {
  item?: IUserInfo;
  message?: string;
}

export interface IUserInfo {
  user?: IUser;
  documents?: IDocument[];
  loyalties?: ILoyalty[];
}

export interface IUser {
  id?: string;
  totalPoint?: number;
}
