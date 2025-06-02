// pages/api/user/upgrade-plan.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).end();

  const { planId } = req.body;
  if (!planId) return res.status(400).json({ message: "Plan ID is required" });

  // TODO: 실제 플랜 변경 로직 (결제 성공 후)
  return res.status(200).json({ message: "Plan upgraded", newPlan: planId });
}
