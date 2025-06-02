// pages/api/auth/reset-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password required." });
  }

  // TODO: token 검증 + 사용자 식별 후 비밀번호 변경
  const hashed = await bcrypt.hash(newPassword, 10);

  console.log(`✅ Password reset with token: ${token}`);
  return res.status(200).json({ message: "Password successfully reset." });
}
