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
  attachments: Array<{ name: string; storedPath: string; sha: string; size: number; streamUrl: string }>;
};

const projectSeedData: ProjectSeed[] = [
  {
    title: "Whispa",
    description:
      "A random chat alternative to find friends, connect with people, and chat with strangers.",
    startDate: new Date("2025-01-01"),
    isInProgress: true,
    tags: ["NextJS", "Fastify", "GraphQL", "SocketIO", "Postgres"],
    links: [
      { name: "Live", url: "https://whispa.sdsarun.dev" },
      { name: "GitHub", url: "https://github.com/boonpermyo/whispa" }
    ],
    attachments: []
  },
  {
    title: "Portfolio CMS",
    description:
      "A content management system used for my personal portfolio website. It helps me manage projects, content, and pages easily without changing code. Built with Next.js for fast loading, good SEO, and a smooth user experience.",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-31"),
    tags: ["NextJS"],
    links: [
      { name: "Live", url: "https://portfolio-cms.sdsarun.dev/work" },
      { name: "GitHub", url: "https://github.com/sdsarun/portfolio-cms" }
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
      { name: "Live", url: "https://no-more-random-ad.vercel.app" },
      { name: "GitHub", url: "https://github.com/sdsarun/no-more-random-ad" }
    ],
    attachments: [
      {
        name: "no-more-random-ad.png",
        storedPath: "screenshots/portfolio/no-more-random-ad.png",
        sha: "ae4797aa5a34c6a48775293d86bbc58a9270bacf",
        size: 161963,
        streamUrl:
          "https://raw.githubusercontent.com/sdsarun/assets/main/screenshots/portfolio/no-more-random-ad.png"
      }
    ]
  },
  {
    title: "Coastal Sea Depth Platform",
    description:
      "Coastal depth survey data, enabling the display of various map layers, including base maps, satellite and digital elevation models (DEM).",
    startDate: new Date("2024-01-01"),
    tags: [],
    links: [{ name: "Live", url: "https://coastalseadepth.com" }],
    attachments: [
      {
        name: "coastal-sea-depth.png",
        storedPath: "screenshots/portfolio/coastal-sea-depth.png",
        sha: "5a42ef426aabfa089193eeb7421912e678030d8d",
        size: 247123,
        streamUrl:
          "https://raw.githubusercontent.com/sdsarun/assets/main/screenshots/portfolio/coastal-sea-depth.png"
      }
    ]
  },
  {
    title: "Smart Tax",
    description:
      "Intelligent tax collection and valuation system facilitate citizens as a one-stop-service for submitting an online petition form, payment check and status tracking.",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2025-01-01"),
    tags: [],
    links: [
      { name: "Landing", url: "https://bedrockanalytics.ai/th/products/smart-municipal-tax-solution" }
    ],
    attachments: []
  },
  {
    title: "xx-portfolio",
    description: "A personal portfolio showcasing projects, skills, and experience.",
    startDate: new Date("2023-01-01"),
    tags: ["Vite", "TailwindCSS"],
    links: [
      { name: "Live", url: "https://xx-portfolio.vercel.app" },
      { name: "GitHub", url: "https://github.com/sdsarun/xx-portfolio" }
    ],
    attachments: [
      {
        name: "xx-portfolio.png",
        storedPath: "screenshots/portfolio/xx-portfolio.png",
        sha: "bd0c7c7e0e06b107bdfa130d5ccdd5102d55ea40",
        size: 224895,
        streamUrl:
          "https://raw.githubusercontent.com/sdsarun/assets/main/screenshots/portfolio/xx-portfolio.png"
      }
    ]
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
          tags: project.tags.join(",") || null,
          displayOrder: index + 1,
          projectLinks: {
            createMany: {
              data: project.links,
              skipDuplicates: true
            }
          },
          projectExperienceAttachments: {
            createMany: {
              data: attachmentCreated.map((a) => ({ attachmentId: a.id })),
              skipDuplicates: true
            }
          }
        }
      });
    }
    logger.info("projectExperience not exists, created.");
  } else {
    logger.info("projectExperience exists, skip created.");
    return exists;
  }
}
