import { claimOffer } from "@/features/loyalty/api";
import { ITokenAndRole } from "@/interfaces/general";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { role, idToken } = await getSessionToken(req);
  // const dispatch = useDispatch();

  // console.log("-----USER----");
  if (req.method === "GET") {
    console.log("GET");
  } else if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const response = await claimOffer(body.siteId, body.offerId, role, idToken);

    if (response.message === "") {
      res.status(200).json(response.item);
    } else {
      res.status(500).json(response.item);
    }
  } else if (req.method === "PUT") {
    console.log("PUT");
  } else if (req.method === "DELETE") {
    console.log("DELETE");
  }
  res.end();
}

const getSessionToken = async (req: NextApiRequest): Promise<ITokenAndRole> => {
  const session: any = await getSession({ req });
  const role: string = session?.role || "";
  const idToken: string = session?.id_token || "";
  return { role, idToken };
};
