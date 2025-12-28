import "./infrastructure/env/env.loader";

import { logger } from "./infrastructure/logger/logger";
import { env } from "./infrastructure/env/env.config";
import { createFastifyApp } from "./infrastructure/http/fastify/fastify-app";

async function bootstrap() {
  const app = createFastifyApp();

  await app.listen({ port: env.PORT, host: env.HOST });

  process.on("SIGTERM", () => {
    logger.info({ signal: "SIGTERM" }, "Shutdown signal received");
    void app.shutdown().finally(() => process.exit(0));
  });

  process.on("SIGINT", () => {
    logger.info({ signal: "SIGINT" }, "Shutdown signal received");
    void app.shutdown().finally(() => process.exit(0));
  });
}

void bootstrap();
