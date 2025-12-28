import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { logger } from "../../src/infrastructure/logger/logger";

export async function seedWorkExperience(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.workExperience.findFirst({
    where: { profileId }
  });

  logger.info({ exists }, "workExperience exists");

  if (!exists) {
    await db.workExperience.createMany({
      data: [
        {
          profileId,
          displayOrder: 1,
          companyName: "T.C.C. Technology Co., Ltd.",
          jobTitle: "Application Developer",
          startDate: new Date("2025-07-02"),
          endDate: null,
          isCurrent: true,
          description: [
            "Developed sustainability management platform for enterprise teams.",
            "Developed micro-frontends using React and Webpack Module Federation to support independent frontend development.",
            "Built and maintained a shared React UI component library with clean, reusable component design, reused across multiple micro-frontends."
          ].join("\n")
        },
        {
          profileId,
          displayOrder: 2,
          companyName: "Synergy Global Network Co., Ltd.",
          jobTitle: "Software Developer",
          startDate: new Date("2023-08-01"),
          endDate: new Date("2025-07-01"),
          isCurrent: false,
          description: [
            "Developed frontend features using Next.js and backend services using NestJS.",
            "Contributed to production systems by implementing new features, fixing bugs, and refactoring existing codebases to improve maintainability and support future changes.",
            "Maintained and improved existing systems by applying refactoring to enhance code quality."
          ].join("\n")
        }
      ]
    });
    logger.info("workExperience not exists, created.");
  } else {
    logger.info("workExperience exists, skip created.");
  }
}
