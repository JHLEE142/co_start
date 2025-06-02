// pages/api/user/usage.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: DB 조회 후 사용자별 사용량 집계
  return res.status(200).json({
    totalTokens: 14320,
    totalRequests: 58,
    lastUsed: "2025-04-29 12:03",
  });
}
