import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../libs/redis";
import { createAccessToken, createRefreshToken } from "../../api/auth";
import { sendRefreshToken } from "../../api/sendRefreshToken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // const id = await createUser(req.body.userId);
    // const accessToken = createAccessToken(id);
    // sendRefreshToken(res, createRefreshToken(accessToken));
    // res.status(200).json({ accessToken });
  }
  if (req.method === "GET") {
    const token = req.cookies["qwdq"];
    if (!token) return res.status(200).json(null);
    const { accessToken } = verify(token, process.env.REFRESH_TOKEN_SECRET);

    sendRefreshToken(res, createRefreshToken(accessToken));

    res.status(200).json({ accessToken });
  }
}
