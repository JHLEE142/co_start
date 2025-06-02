// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 클라이언트에서 localStorage 토큰 삭제하면 됨
  return res.status(200).json({ message: "Logged out (client should delete token)" });
}
