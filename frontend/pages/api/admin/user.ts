// pages/api/admin/users.ts
import type { NextApiRequest, NextApiResponse } from "next";

const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    nickname: "AdminUser",
    plan: "Team",
    created_at: "2024-12-01",
  },
  {
    id: "2",
    email: "jane@example.com",
    nickname: "JaneDoe",
    plan: "Pro",
    created_at: "2025-01-10",
  },
  {
    id: "3",
    email: "tom@example.com",
    nickname: "TomLee",
    plan: "Basic",
    created_at: "2025-02-17",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(mockUsers);
}
