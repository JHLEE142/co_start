// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // 개발 중 로그 확인용, 배포 시 제거 가능
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
