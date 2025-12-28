import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { env } from "../../src/infrastructure/env/env.config";
import { logger } from "../../src/infrastructure/logger/logger";
import { Argon2PasswordHasher } from "../../src/infrastructure/security/argon2.password-hasher";

export async function seedAuth(db: PrismaClientOrTransaction) {
  const passwordHasher = new Argon2PasswordHasher({ pepper: env.PASSWORD_PEPPER });
  const hashPassword = await passwordHasher.hash(env.PASSWORD_AUTH);

  const exists = await db.auth.findFirst({
    where: { id: env.AUTH_ID }
  });

  logger.info({ exists }, "auth exists");

  if (!exists) {
    await db.auth.create({ data: { id: env.AUTH_ID, hashPassword } });
    logger.info("auth not exists, created.");
  } else {
    logger.info("auth exists, skip created.");
  }
}
