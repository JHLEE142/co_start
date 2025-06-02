// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname,
      plan: {
        connect: { id: "basic" }, // 🔧 basic 플랜이 존재해야 함
      },
    },
  });

  return res.status(201).json({
    message: "Signup successful",
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    },
  });
}
