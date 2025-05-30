// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.createMany({
    data: [
      { id: "basic", name: "Basic", price: 0, coins: 20 },
      { id: "pro", name: "Pro", price: 25, coins: 350 },
      { id: "enterprise", name: "Enterprise", price: 0, coins: 9999 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Plans seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
