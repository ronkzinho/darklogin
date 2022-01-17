import { genSalt, hashSync } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { createAccessToken, createRefreshToken } from "../../api/auth";
import { sendRefreshToken } from "../../api/sendRefreshToken";
import { createUser, getUserWithEmailOrUsername } from "../../libs/redis";
import { fieldError } from "../../util/fieldError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, username }: { [key: string]: string } = req.body;
  const errors: fieldError[] = [];
  if (email.length <= 3) {
    errors.push({ field: "email", message: "must be at least 4 characters" });
  } else if (!email?.includes("@")) {
    errors.push({ field: "email", message: "Invalid email" });
  }
  if (password?.length <= 5) {
    errors.push({
      field: "password",
      message: "must be at least 6 characters",
    });
  }
  if (!username || username.length <= 4) {
    errors.push({
      field: "username",
      message: "must be at least 5 characters",
    });
  } else if (username.includes("@")) {
    errors.push({ field: "username", message: "must not have @" });
  }

  if (errors.length > 0) {
    return res.status(200).json({ errors });
  }

  if ((await getUserWithEmailOrUsername(email))?.entityId) {
    errors.push({ field: "email", message: "already exists" });
  }

  if ((await getUserWithEmailOrUsername(username))?.entityId) {
    errors.push({ field: "username", message: "already exists" });
  }

  if (errors.length > 0) {
    return res.status(200).json({ errors });
  }
  const id = await createUser({
    username,
    email,
    password: hashSync(password, await genSalt()),
  });
  const accessToken = createAccessToken(id);
  const refreshToken = createRefreshToken(accessToken);
  sendRefreshToken(res, refreshToken);

  res.status(200).json({ accessToken, errors });
}
