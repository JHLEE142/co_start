// pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // TODO: 실제 사용자 검색 및 이메일 발송
  console.log(`🔐 Password reset link sent to: ${email}`);

  return res.status(200).json({
    message: "If this email is registered, a reset link has been sent.",
  });
}
