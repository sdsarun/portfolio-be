import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { HealthHandler } from "./handlers/health/health.handler";

export class SystemRoutes implements HttpRouteDefinition {
  constructor(private readonly healthHandler: HealthHandler) {}

  routes(): HttpRoute[] {
    return [
      {
        path: "/system/health",
        method: "GET",
        handler: this.healthHandler
      }
    ];
  }
}
