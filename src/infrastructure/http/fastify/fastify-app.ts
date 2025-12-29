import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { logger } from "../../logger/logger";
import { createApplicationContext } from "../../ioc/create-application-context";
import { fastifyRegisterRoutes } from "./fastify-register-routes";
import { type HttpAppliaction } from "../http.port";
import { getCorsConfig } from "../cors.config";

export function createFastifyApp(): HttpAppliaction {
  const server = fastify({ loggerInstance: logger });
  server.register(fastifyCookie);
  server.register(fastifyCors, getCorsConfig());

  const ctx = createApplicationContext();
  const { db, cache } = ctx.external;

  fastifyRegisterRoutes(server, ctx.routes);

  return {
    async listen(options): Promise<void> {
      const { port, host = "0.0.0.0" } = options || {};
      try {
        await db.connect();
        logger.info("Database connection success");
        await cache.connect();
        logger.info("Cache connection success");
      } catch (error) {
        logger.error(
          error,
          "application bootstrap error: something went wrong while connect external service"
        );
        return this.shutdown();
      }

      await server.listen({ port, host });
      logger.info({ port, host }, "Starting HTTP server");
      logger.info("HTTP server is listening");
    },
    async shutdown(): Promise<void> {
      await Promise.allSettled([db.disconnect(), cache.disconnect()]);
      await server.close();
      logger.info("HTTP server stopped");
    }
  };
}
