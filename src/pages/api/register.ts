import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUser } from "../../libs/redis";
import { serialize } from "cookie";
import { createAccessToken, createRefreshToken } from "../../api/auth";
import { sendRefreshToken } from "../../api/sendRefreshToken";
import { genSalt, hashSync } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, username } = req.body;
  const id = await createUser({
    username,
    email,
    password: hashSync(password, await genSalt()),
  });
  const accessToken = createAccessToken(id);
  const refreshToken = createRefreshToken(accessToken);
  sendRefreshToken(res, refreshToken);

  res.status(200).json({ accessToken });
}
