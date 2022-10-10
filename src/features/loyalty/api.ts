import { ILoyaltyResponse } from "@/interfaces/loyalty";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export async function newVisit(
  siteId: string,
  documentId: string,
  role: string,
  idToken: string
): Promise<ILoyaltyResponse> {
  const url = BASE_URL + "/v1/loyalty/end_user/new_visit";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorizationToken: role + "*-*" + idToken,
    },
    body: JSON.stringify({ siteId, documentId }),
  });

  const result = await response.json();

  return result;
}

export async function claimOffer(
  siteId: string,
  offerId: string,
  role: string,
  idToken: string
): Promise<ILoyaltyResponse> {
  const url = BASE_URL + "/v1/loyalty/end_user/claim_offer";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorizationToken: role + "*-*" + idToken,
    },
    body: JSON.stringify({ siteId, offerId }),
  });

  const result = await response.json();

  return result;
}
