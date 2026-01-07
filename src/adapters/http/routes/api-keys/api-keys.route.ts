import { type HttpMiddleware, type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type CreateApiKeyHandlerPort } from "./handlers/create-api-key/create-api-key.handler";
import { type GetApiKeysHandlerPort } from "./handlers/get-api-keys/get-api-keys.handler";

export class ApiKeysRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      requiredTokenMiddleware: HttpMiddleware;
      getApiKeysHandler: GetApiKeysHandlerPort;
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
      },
      {
        method: "GET",
        path: "/api-keys",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getApiKeysHandler
      }
    ];
  }
}
