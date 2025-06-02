// pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: any[] = []; // 임시 유저 저장 (실제론 DB 사용해야 함)

const SECRET_KEY = process.env.JWT_SECRET || "temp_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method === "POST") {
    const { type, email, password, nickname } = body;

    if (type === "signup") {
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) return res.status(400).json({ message: "The email is already registered." });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: users.length + 1, email, password: hashedPassword, nickname };
      users.push(newUser);
      return res.status(200).json({ message: "Sign up successful" });
    }

    if (type === "login") {
      const user = users.find((u) => u.email === email);
      if (!user) return res.status(401).json({ message: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Password is incorrect." });

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
      return res.status(200).json({ token });
    }
  }

  return res.status(405).json({ message: "This request is not allowed." });
}
