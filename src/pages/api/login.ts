import { NextApiRequest, NextApiResponse } from "next";
import { createAccessToken, createRefreshToken } from "../../api/auth";
import { getUser, getUserLogin } from "../../libs/redis";
import { sendRefreshToken } from "../../api/sendRefreshToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.email) return res.status(200).json(null);

  const user = await getUserLogin(req);
  if (!user) return res.status(200).json(null);
  if (!user.entityId) return res.status(200).json(null);
  const accessToken = createAccessToken(user.entityId);
  const refreshToken = createRefreshToken(accessToken);
  sendRefreshToken(res, refreshToken);

  return res.status(200).json({ accessToken });
}
