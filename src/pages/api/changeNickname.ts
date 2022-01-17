import { NextApiRequest, NextApiResponse } from "next";
import { getUserWithAccesstoken } from "../../api/auth";
import { changeUserNickname } from "../../libs/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserWithAccesstoken(req);
  const { newNickname }: { [key: string]: string } = req.body;
  if (!newNickname || newNickname.length <= 3 || newNickname.includes("@")) {
    res.status(200).json({
      errors: [{ field: "newNickname", message: "invalid nickname" }],
    });
  } else if (user) {
    await changeUserNickname(user.entityId, newNickname);

    return res.status(200).json({ errors: [] });
  } else {
    res
      .status(200)
      .json({ errors: [{ field: "user", message: "not authenticated" }] });
  }
}
