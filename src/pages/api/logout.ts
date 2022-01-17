import { NextApiRequest, NextApiResponse } from "next";
import { sendRefreshToken } from "../../api/sendRefreshToken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  sendRefreshToken(res, "");

  res.status(200).json({ success: true });
  return res.end();
}
