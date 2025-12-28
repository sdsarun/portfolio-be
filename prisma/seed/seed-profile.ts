import { type PrismaClientOrTransaction } from "../../src/infrastructure/db/prisma/prisma-database-session";
import { env } from "../../src/infrastructure/env/env.config";
import { logger } from "../../src/infrastructure/logger/logger";

export async function seedProfile(db: PrismaClientOrTransaction) {
  const profileExists = await db.profile.findFirst({
    where: {
      authId: env.AUTH_ID
    }
  });

  logger.info({ profileExists }, "profile exists");

  if (!profileExists) {
    const newProfileCreated = await db.profile.create({
      data: {
        authId: env.AUTH_ID,
        displayName: "Sarun Daunghirun",
        roleName: "Software Developer",
        bioTitle: "Who's Here!",
        bioDescription:
          "I'm a fullstack developer with a love for clean UI, minimal design, and smooth UX. I build with Next.js, NestJS, and everything in between. Outside of coding, I’m into cycling, tech, and small side projects. This site is a simple showcase of personal experiments, client work, and things I’ve been tinkering with—some polished, some still baking. Built with passion, curiosity, and way too many late nights. Feel free to explore what I've been up to below.",
        resumeUrl: "https://drive.google.com/file/d/1YGoDFuydt_821xUvxPqbKZKrrxohZk9c/view",
        siteUrl: "https://sdsarun.dev/"
      }
    });
    logger.info("profile does not exists, created");
    return newProfileCreated;
  } else {
    logger.info("profile exists, skip created");
    return profileExists;
  }
}
