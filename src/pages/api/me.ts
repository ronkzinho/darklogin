import { NextApiRequest, NextApiResponse } from "next";
import { getUserWithAccesstoken } from "../../api/auth";
import { getSafeUser } from "../../entities/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const rawUser = await getUserWithAccesstoken(req);

    res.status(200).json(rawUser ? getSafeUser(rawUser) : null);
  }
}
