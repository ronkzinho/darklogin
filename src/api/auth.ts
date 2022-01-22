import { sign, verify } from "jsonwebtoken";
import { NextApiRequest } from "next";
import { getUser } from "../libs/redis";

export const createAccessToken = (userId: string) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userId: string) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const getUserWithAccesstoken = async (req: NextApiRequest) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) return null;
    const rawUser = await getUser(
      verify(authorization.split(" ")[1], process.env.ACCESS_TOKEN_SECRET)
        .userId
    );

    return rawUser;
  } catch (e) {
    return null;
  }
};
