import { NextApiResponse } from "next";
import { serialize } from "cookie";

export const sendRefreshToken = (res: NextApiResponse, token: string) => {
  res.setHeader("Set-Cookie", serialize("qwdq", token, { path: "/api/token" }));
};
