import { serialize } from "cookie";
import { NextApiResponse } from "next";

export const sendRefreshToken = (res: NextApiResponse, token: string) => {
  res.setHeader("Set-Cookie", serialize("qwdq", token, { path: "/api/token" }));
};
