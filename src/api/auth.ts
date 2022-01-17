import { sign, verify } from "jsonwebtoken";
import { NextApiRequest } from "next";
import { getUser } from "../libs/redis";

export const createAccessToken = (id: string) => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (accessToken: string) => {
  return sign({ accessToken }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const getUserWithAccesstoken = async (req: NextApiRequest) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) return null;
    const rawUser = await getUser(
      verify(authorization.split(" ")[1], process.env.ACCESS_TOKEN_SECRET).id
    );

    return rawUser;
  } catch {
    return null;
  }
};
