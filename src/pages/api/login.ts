import { compareSync } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { createAccessToken, createRefreshToken } from "../../api/auth";
import { sendRefreshToken } from "../../api/sendRefreshToken";
import { getUserWithEmailOrUsername } from "../../libs/redis";
import { fieldError } from "../../util/fieldError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emailOrUsername, password }: { [key: string]: string } = req.body;

  const errors: fieldError[] = [];

  if (!emailOrUsername) {
    errors.push({
      field: "emailOrUsername",
      message: "invalid email or username",
    });
  }

  if (!password) {
    errors.push({ field: "password", message: "invalid password" });
  }

  if (errors.length > 0) {
    return res.status(200).json({ errors });
  }

  const user = await getUserWithEmailOrUsername(emailOrUsername);

  if (!user || !user.entityId) {
    errors.push({ field: "emailOrUsername", message: "not found" });
  } else if (!compareSync(password, user.password)) {
    errors.push({ field: "password", message: "wrong password" });
  }

  if (errors.length > 0) {
    return res.status(200).json({ errors });
  }

  const accessToken = createAccessToken(user.entityId);
  const refreshToken = createRefreshToken(accessToken);
  sendRefreshToken(res, refreshToken);

  return res.status(200).json({ accessToken, errors });
}
