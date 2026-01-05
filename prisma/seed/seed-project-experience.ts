import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { logger } from "../../src/infrastructure/logger/logger";

type ProjectSeed = {
  title: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isInProgress?: boolean | null;
  tags: string[];
  links: Array<{ name: string; url: string | null }>;
  attachments: Array<{ storedPath: string }>;
};

const projectSeedData: ProjectSeed[] = [
  {
    title: "Whispa",
    description:
      "A random chat alternative to find friends, connect with people, and chat with strangers.",
    startDate: new Date("2025-01-01"),
    isInProgress: true,
    tags: ["NextJS", "NestJS", "GraphQL", "SocketIO", "Postgres"],
    links: [
      { name: "Live", url: null },
      { name: "GitHub", url: null }
    ],
    attachments: []
  },
  {
    title: "No More Random AD",
    description: "Generate random data without the annoyance of ads.",
    startDate: new Date("2025-01-01"),
    isInProgress: false,
    endDate: new Date("2025-01-01"),
    tags: ["NextJS", "Shadcn-UI"],
    links: [
      { name: "Live", url: null },
      { name: "GitHub", url: null }
    ],
    attachments: []
  },
  {
    title: "Coastal Sea Depth Platform",
    description:
      "Coastal depth survey data, enabling the display of various map layers, including base maps, satellite and digital elevation models (DEM).",
    startDate: new Date("2024-01-01"),
    tags: [],
    links: [{ name: "Live", url: null }],
    attachments: []
  },
  {
    title: "Smart Tax",
    description:
      "Intelligent tax collection and valuation system facilitate citizens as a one-stop-service for submitting an online petition form, payment check and status tracking.",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2025-01-01"),
    tags: [],
    links: [{ name: "Landing", url: null }],
    attachments: []
  },
  {
    title: "xx-portfolio",
    description: "A personal portfolio showcasing projects, skills, and experience.",
    startDate: new Date("2023-01-01"),
    tags: ["Vite", "TailwindCSS"],
    links: [
      { name: "Live", url: null },
      { name: "GitHub", url: null }
    ],
    attachments: []
  }
];

export async function seedProjectExperience(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.projectExperience.findMany({
    where: { profileId }
  });

  logger.info({ exists }, "projectExperience exists");

  if (exists.length === 0) {
    for (const [index, project] of projectSeedData.entries()) {
      const attachmentCreated = await db.attachment.createManyAndReturn({
        data: project.attachments,
        skipDuplicates: true
      });

      await db.projectExperience.create({
        data: {
          profileId,
          title: project.title,
          description: project.description,
          isInProgress: project.isInProgress ?? null,
          startDate: project.startDate ?? null,
          endDate: project.endDate ?? null,
          tags: project.tags?.join(", ") ?? null,
          displayOrder: index + 1,
          projectLinks: {
            createMany: {
              data: project?.links?.map?.((link) => ({
                name: link.name,
                url: link.url
              })),
              skipDuplicates: true
            }
          },
          projectExperienceAttachments: {
            createMany: {
              data: attachmentCreated.map((a) => ({ attachmentId: a.id })),
              skipDuplicates: true
            }
          }
        },
        include: {
          projectLinks: true
        }
      });
    }
    logger.info("projectExperience not exists, created.");
  } else {
    logger.info("projectExperience exists, skip created.");
    return exists;
  }
}
