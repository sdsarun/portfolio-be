import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { logger } from "../../src/infrastructure/logger/logger";

const skillSeedData = [
  {
    categoryName: "Programming Languages",
    skillNames: ["TypeScript", "JavaScript"]
  },
  {
    categoryName: "Libraries / Frameworks",
    skillNames: [
      "React",
      "NextJS",
      "NestJS",
      "Mapbox",
      "Antd",
      "Tanstack Query",
      "Vitest",
      "Jest",
      "SocketIO",
      "GraphQL"
    ]
  },
  {
    categoryName: "Tools / Platforms",
    skillNames: ["Git", "GitLab", "Docker", "Keycloak", "MinIO", "Swagger", "VIM"]
  },
  {
    categoryName: "Databases",
    skillNames: ["PostgreSQL"]
  }
];

export async function seedSkills(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.skill.findFirst({
    where: { profileId }
  });

  logger.info({ exists }, "skill exists");

  if (!exists) {
    await db.skill.createMany({
      data: skillSeedData.map((item, index) => ({
        profileId,
        categoryName: item.categoryName,
        skillNames: item.skillNames.join(", "),
        displayOrder: index + 1
      }))
    });
    logger.info("skills not exists, created.");
  } else {
    logger.info("skills exists, skip created.");
  }
}
