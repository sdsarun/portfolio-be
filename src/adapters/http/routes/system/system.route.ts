import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type HealthHandlerPort } from "./handlers/health/health.handler";

export class SystemRoutes implements HttpRouteDefinition {
  constructor(private readonly deps: { healthHandler: HealthHandlerPort }) {}

  routes(): HttpRoute[] {
    return [
      {
        path: "/system/health",
        method: "GET",
        handler: this.deps.healthHandler
      }
    ];
  }
}
