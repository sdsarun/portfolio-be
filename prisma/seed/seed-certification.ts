import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { logger } from "../../src/infrastructure/logger/logger";

export async function seedCertification(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.certification.findFirst({
    where: { profileId }
  });

  logger.info({ exists }, "certification exists");

  if (!exists) {
    await db.certification.createMany({
      data: [
        {
          profileId,
          name: "Junior Software Developer",
          issuer: "Generation Thailand"
        }
      ]
    });
    logger.info("certification not exists, created.");
  } else {
    logger.info("certification exists, skip created.");
  }
}
