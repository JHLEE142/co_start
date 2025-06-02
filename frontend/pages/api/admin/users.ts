// pages/api/admin/user.ts
import type { NextApiRequest, NextApiResponse } from "next";

const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    nickname: "AdminUser",
    plan: "Team",
    model: "GPT-4",
    joined: "2024-12-01",
    requests: 985,
    tokens_used: "234,210",
  },
  {
    id: "2",
    email: "jane@example.com",
    nickname: "JaneDoe",
    plan: "Pro",
    model: "GPT-3.5",
    joined: "2025-01-15",
    requests: 421,
    tokens_used: "102,348",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const user = mockUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}
