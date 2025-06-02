// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);
    return res.status(200).json({ user: payload });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
