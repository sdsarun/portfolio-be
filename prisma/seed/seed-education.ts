import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { logger } from "../../src/infrastructure/logger/logger";

export async function seedEducation(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.education.findFirst({
    where: { profileId }
  });

  logger.info({ exists }, "education exists");

  if (!exists) {
    await db.education.createMany({
      data: [
        {
          profileId,
          major: "B.Sc. Computer Science",
          institution: "Sukhothai Thammathirat Open University",
          startDate: new Date("2018-01-01"),
          endDate: new Date("2023-01-01")
        }
      ]
    });
    logger.info("education not exists, created.");
  } else {
    logger.info("education exists, skip created.");
  }
}
