import "./src/infrastructure/env/env.loader";

import { env } from "./src/infrastructure/env/env.config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed/seed-runner.ts"
  },
  datasource: {
    url: env.DATABASE_URL
  }
});
