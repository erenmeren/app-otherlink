import { ISiteResponse } from "@/interfaces/site";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export async function getSiteById(siteId: string): Promise<ISiteResponse> {
  const url = BASE_URL + "/v1/site/" + siteId;

  const response = await fetch(url);

  return await response.json();
}
