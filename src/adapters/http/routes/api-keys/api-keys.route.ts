import { type HttpMiddleware, type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type CreateApiKeyHandlerPort } from "./handlers/create-api-key/create-api-key.handler";

export class ApiKeysRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      requiredTokenMiddleware: HttpMiddleware;
      createApiKeyHandler: CreateApiKeyHandlerPort;
    }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "POST",
        path: "/api-keys",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.createApiKeyHandler
      }
    ];
  }
}
