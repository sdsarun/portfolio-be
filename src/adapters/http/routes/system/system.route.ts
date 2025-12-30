import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type HealthHandlerPort } from "./handlers/health/health.handler";
import { TestHandlerPort } from "./handlers/test/test.handler";

export class SystemRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: { healthHandler: HealthHandlerPort; testHandler: TestHandlerPort }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        path: "/system/health",
        method: "GET",
        handler: this.deps.healthHandler
      },
      {
        path: "/system/test",
        method: "GET",
        handler: this.deps.testHandler
      }
    ];
  }
}
