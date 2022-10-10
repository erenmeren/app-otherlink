import { getUserInfo } from "@/features/user/api";
import { ITokenAndRole } from "@/interfaces/general";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { role, idToken } = await getSessionToken(req);

  // console.log("-----USER----");
  if (req.method === "GET") {
    const response = await getUserInfo(role, idToken);

    if (response.message === "") {
      res.status(200).json(response);
    } else {
      res.status(200).json(response);
    }
  } else if (req.method === "POST") {
    console.log("POST");
  } else if (req.method === "PUT") {
    console.log("PUT");
  } else if (req.method === "DELETE") {
    console.log("DELETE");
  }
  res.end();
}

const getSessionToken = async (req: NextApiRequest): Promise<ITokenAndRole> => {
  const session: any = await getSession({ req });

  const idToken: string = session?.id_token || "";
  const role: string = session?.role || "user";

  return { role, idToken };
};
