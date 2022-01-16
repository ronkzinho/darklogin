import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserWithAcesstoken } from "../../api/auth";
import { getSafeUser } from "../../entities/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const rawUser = await getUserWithAcesstoken(req);

    res.status(200).json(rawUser ? getSafeUser(rawUser) : null);
  }
}
