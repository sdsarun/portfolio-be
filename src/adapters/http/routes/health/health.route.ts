import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type HealthHandlerPort } from "./handlers/health.handler";

export class HealthRoutes implements HttpRouteDefinition {
  constructor(private readonly deps: { healthHandler: HealthHandlerPort }) {}

  routes(): HttpRoute[] {
    return [
      {
        path: "/health",
        method: "GET",
        handler: this.deps.healthHandler
      }
    ];
  }
}
