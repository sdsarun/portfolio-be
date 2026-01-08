import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type AccessControlMiddleware } from "../../middlewares/auth/access-control.middleware";
import { type CreateApiKeyHandlerPort } from "./handlers/create-api-key/create-api-key.handler";
import { type DeleteApiKeyByIdHandlerPort } from "./handlers/delete-api-key-by-id/delete-api-key-by-id.handler";
import { type GetApiKeysHandlerPort } from "./handlers/get-api-keys/get-api-keys.handler";
import { type RevokeApiKeysHandlerPort } from "./handlers/revoke-api-keys/revoke-api-keys.handler";

export class ApiKeysRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      accessControlMiddleware: AccessControlMiddleware;
      getApiKeysHandler: GetApiKeysHandlerPort;
      createApiKeyHandler: CreateApiKeyHandlerPort;
      deleteApiKeyByIdHandler: DeleteApiKeyByIdHandlerPort;
      revokeApiKeysHandler: RevokeApiKeysHandlerPort;
    }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "POST",
        path: "/api-keys",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer"] })],
        handler: this.deps.createApiKeyHandler
      },
      {
        method: "POST",
        path: "/api-keys/revoke",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer"] })],
        handler: this.deps.revokeApiKeysHandler
      },
      {
        method: "GET",
        path: "/api-keys",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer"] })],
        handler: this.deps.getApiKeysHandler
      },
      {
        method: "DELETE",
        path: "/api-keys/:id",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer"] })],
        handler: this.deps.deleteApiKeyByIdHandler
      }
    ];
  }
}
