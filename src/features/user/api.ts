import { IDocumentResponse } from "@/interfaces/document";
import { IUserInfoResponse } from "@/interfaces/user";

const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export async function createUser(
  role: string,
  idToken: string,
  firstname: string,
  lastname: string,
  email: string,
  sub: string,
  prviderName: string
): Promise<any> {
  const response = await fetch(baseURL + "/v1/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorizationToken: role + "*-*" + idToken,
    },
    body: JSON.stringify({
      firstname,
      lastname,
      email,
      sub,
      prviderName,
      role,
    }),
  });

  const result = await response.json();
  return result;
}

export async function getUserInfo(
  role: string,
  idToken: string
): Promise<IUserInfoResponse> {
  const response = await fetch(baseURL + "/v1/user/end_user_info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorizationToken: role + "*-*" + idToken,
    },
  });

  const result = await response.json();

  return result;
}

export async function addDocumentToUser(
  documentId: string,
  role: string,
  idToken: string
): Promise<IDocumentResponse> {
  const response = await fetch(
    baseURL + "/v1/document/end_user/keep_document",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorizationToken: role + "*-*" + idToken,
      },
      body: JSON.stringify({ documentId }),
    }
  );

  const result = await response.json();

  return result;
}
