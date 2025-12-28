import { FastifyInstance, FastifyRequest } from "fastify";
import {
  executeHttpRoute,
  type HttpRequest,
  type HttpRouteDefinition
} from "../../../adapters/http/http-adapter.port";
import { logger } from "../../logger/logger";

function toHttpRequest(request: FastifyRequest): HttpRequest {
  let ip: string = request.ip;
  const xff = request.headers["x-forwarded-for"] as string;
  if (xff) {
    ip = xff?.split?.(",")[0].trim();
  }

  return {
    body: request.body,
    cookies: request.cookies,
    headers: request.headers,
    params: request.params,
    query: request.query,
    requestMeta: {
      path: request.url,
      ip
    }
  };
}

export function fastifyRegisterRoutes(
  server: FastifyInstance<any, any, any, any>,
  routeDefinitions: HttpRouteDefinition[]
) {
  for (const routeDefinition of routeDefinitions) {
    const routes = routeDefinition.routes();
    for (const route of routes) {
      const resolvedUrl = route.version ? `/v${route.version}${route.path}` : route.path;
      server.route({
        method: route.method,
        url: resolvedUrl,
        handler: async (request, reply) => {
          await executeHttpRoute(route, toHttpRequest(request), {
            success: ({ statusCode, data }) => {
              reply.status(statusCode);
              if (typeof data !== "undefined") {
                reply.send(data);
              }
            },
            error: ({ statusCode, error }) => {
              reply.header("content-type", "application/problem+json").status(statusCode).send(error);
            }
          });
        }
      });
      logger.info(`Mapped ${resolvedUrl}`);
    }
  }
}
