// pages/api/admin/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Prisma 연결 후 DB 통계 가져오기
  const stats = {
    totalUsers: 134,
    totalChats: 9542,
    totalTokensUsed: 1240000,
    avgResponseTime: "850ms",
  };

  return res.status(200).json(stats);
}
