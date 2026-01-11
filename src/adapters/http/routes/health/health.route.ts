import { HealthCacheKeys } from "../../../../core/cache/cache-keys/health.cache-keys";
import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type HealthHandlerPort } from "./handlers/health.handler";

export class HealthRoutes implements HttpRouteDefinition {
  constructor(private readonly deps: { healthHandler: HealthHandlerPort }) {}

  routes(): HttpRoute[] {
    return [
      {
        path: "/health",
        method: "GET",
        handler: this.deps.healthHandler,
        cache: {
          key: HealthCacheKeys.getHealth,
          ttlSeconds: 60 * 30
        }
      }
    ];
  }
}
