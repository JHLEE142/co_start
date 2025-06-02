// pages/api/chat/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  // 임시 응답
  return res.status(200).json({
    id,
    title: `Mocked Chat ${id}`,
    prompt: "Hello",
    response: "Hi there!",
    token_usage: 7,
  });
}
