import { IDocumentResponse } from "@/interfaces/document";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export async function getDocumentById(
  documentId: string
): Promise<IDocumentResponse> {
  const url = BASE_URL + "/v1/document/" + documentId;

  const response = await fetch(url);

  const document = await response.json();

  return document;
}

// export async function getDocuments(): Promise<IDocumentsResponse> {
//   // simulate IO latency
// }
