// pages/api/user/update-profile.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).end();

  const { nickname, model } = req.body;

  if (!nickname) return res.status(400).json({ message: "Nickname is required" });

  // TODO: 실제 DB 반영
  return res.status(200).json({
    message: "Profile updated",
    user: {
      nickname,
      model: model || "GPT-4",
    },
  });
}
