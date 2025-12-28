import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { logger } from "../../src/infrastructure/logger/logger";

type ProjectSeed = {
  title: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isInProgress?: boolean | null;
  tags?: string[];
  links?: Array<{ name: string; url: string | null }>;
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
    ]
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
    ]
  },
  {
    title: "Coastal Sea Depth Platform",
    description:
      "Coastal depth survey data, enabling the display of various map layers, including base maps, satellite and digital elevation models (DEM).",
    startDate: new Date("2024-01-01"),
    tags: [],
    links: [{ name: "Live", url: null }]
  },
  {
    title: "Smart Tax",
    description:
      "Intelligent tax collection and valuation system facilitate citizens as a one-stop-service for submitting an online petition form, payment check and status tracking.",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2025-01-01"),
    tags: [],
    links: [{ name: "Landing", url: null }]
  },
  {
    title: "xx-portfolio",
    description: "A personal portfolio showcasing projects, skills, and experience.",
    startDate: new Date("2023-01-01"),
    tags: ["Vite", "TailwindCSS"],
    links: [
      { name: "Live", url: null },
      { name: "GitHub", url: null }
    ]
  }
];

export async function seedProjectExperience(db: PrismaClientOrTransaction, profileId: string) {
  const exists = await db.projectExperience.findFirst({
    where: { profileId }
  });

  logger.info({ exists }, "projectExperience exists");

  if (!exists) {
    for (const [index, project] of projectSeedData.entries()) {
      const created = await db.projectExperience.create({
        data: {
          profileId,
          title: project.title,
          description: project.description,
          isInProgress: project.isInProgress ?? null,
          startDate: project.startDate ?? null,
          endDate: project.endDate ?? null,
          tags: project.tags?.join(", ") ?? null,
          displayOrder: index + 1
        }
      });

      if (project.links?.length) {
        await db.projectLink.createMany({
          data: project.links.map((link) => ({
            projectId: created.id,
            name: link.name,
            url: link.url
          }))
        });
      }
    }
    logger.info("projectExperience not exists, created.");
  } else {
    logger.info("projectExperience exists, skip created.");
  }
}
