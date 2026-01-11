import { ApiKeyCacheKeys } from "../../../../core/cache/cache-keys/api-key.cache-keys";
import { HttpMiddleware, type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
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
      getApiKeysRequestValidator: HttpMiddleware;
      createApiKeyHandler: CreateApiKeyHandlerPort;
      createApiKeyRequestValidator: HttpMiddleware;
      deleteApiKeyByIdHandler: DeleteApiKeyByIdHandlerPort;
      deleteApiKeyRequestValidator: HttpMiddleware;
      revokeApiKeysHandler: RevokeApiKeysHandlerPort;
      revokeApiKeysRequestValidator: HttpMiddleware;
    }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "POST",
        path: "/api-keys",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer"] }),
          this.deps.createApiKeyRequestValidator
        ],
        handler: this.deps.createApiKeyHandler,
        cache: {
          invalidate: [ApiKeyCacheKeys.allPattern]
        }
      },
      {
        method: "POST",
        path: "/api-keys/revoke",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer"] }),
          this.deps.revokeApiKeysRequestValidator
        ],
        handler: this.deps.revokeApiKeysHandler,
        cache: {
          invalidate: [ApiKeyCacheKeys.allPattern]
        }
      },
      {
        method: "GET",
        path: "/api-keys",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer"] }),
          this.deps.getApiKeysRequestValidator
        ],
        handler: this.deps.getApiKeysHandler,
        cache: {
          key: (ctx) => ApiKeyCacheKeys.getApiKeys(ctx.request.query),
          ttlSeconds: 60 * 60
        }
      },
      {
        method: "DELETE",
        path: "/api-keys/:id",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer"] }),
          this.deps.deleteApiKeyRequestValidator
        ],
        handler: this.deps.deleteApiKeyByIdHandler,
        cache: {
          invalidate: [ApiKeyCacheKeys.allPattern]
        }
      }
    ];
  }
}
