import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "admin";
  // const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    email: "admin@admin.com",
    // password: hashedPassword,
    password: "admin",
    emailVerified: new Date(),
  };

  const user = await prisma.user.upsert({
    where: { email: userData.email },
    update: userData,
    create: userData,
  });

  console.log(
    `User Email {${user.email}} Created With Password {${user.password}} `,
    user
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
