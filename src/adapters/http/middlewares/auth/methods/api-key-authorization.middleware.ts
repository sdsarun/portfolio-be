import { ApiKeyCacheKeys } from "../../../../../core/cache/cache-keys/api-key.cache-keys";
import { UnauthorizedError } from "../../../../../core/errors/auth.error";
import { type Cache } from "../../../../../core/ports/cache.port";
import { type Hasher } from "../../../../../core/ports/hasher.port";
import { Logger } from "../../../../../core/ports/logger.port";
import { type UnitOfWork } from "../../../../../core/ports/unit-of-work.port";
import {
  type HttpContext,
  type HttpMiddleware,
  type HttpRequestInput
} from "../../../http-adapter.port";

export class ApiKeyAuthorizationMiddleware implements HttpMiddleware {
  constructor(
    private readonly deps: {
      sha256Hasher: Hasher;
      uow: UnitOfWork;
      cache: Cache;
      logger: Logger;
    }
  ) {}

  async handle(ctx: HttpContext<HttpRequestInput, Record<string, any>>): Promise<void> {
    const { logger, sha256Hasher, uow, cache } = this.deps;

    if (ctx.state?.isAuthenticated) {
      logger.info("Already authenticated, skipping API key check");
      return;
    }

    const request = ctx.request;
    try {
      const apiKey = this.extractApiKeyFromHeader(request.headers);
      if (!apiKey) {
        logger.warn("No API key found in request headers");
        throw new UnauthorizedError();
      }

      const hashedKey = await sha256Hasher.hash(apiKey);
      const cacheKey = ApiKeyCacheKeys.findValidByHashedKey(hashedKey);

      logger.info({ cacheKey }, "Looking up API key in cache");
      const cached = await cache.get<{ id: string; name: string; scope: string }>(cacheKey);

      if (cached) {
        logger.info({ apiKeyId: cached.id, scope: cached.scope }, "API key authenticated from cache");
        ctx.state = {
          authType: "apikey",
          isAuthenticated: true,
          apiKey: cached
        };
        return;
      }

      logger.info("Cache miss, querying database for API key");
      const payload = await uow.apiKey.findValidByHashedKey(hashedKey);
      if (!payload) {
        logger.warn("API key not found or invalid");
        throw new UnauthorizedError();
      }

      const apiKeyData = {
        id: payload.fields.id,
        name: payload.fields.name,
        scope: payload.fields.scope
      };

      logger.info({ cacheKey, ttlSeconds: 300 }, "Caching API key data");
      await cache.set(cacheKey, apiKeyData, { ttlSeconds: 300 });

      logger.info(
        { apiKeyId: apiKeyData.id, scope: apiKeyData.scope },
        "API key authenticated from database"
      );
      ctx.state = {
        authType: "apikey",
        isAuthenticated: true,
        apiKey: apiKeyData
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        logger.warn("API key authorization failed: unauthorized");
        throw error;
      }
      logger.error({ error }, "Unexpected error during API key authorization");
      throw new UnauthorizedError(error instanceof Error ? error.message : undefined);
    }
  }

  private extractApiKeyFromHeader(headers: any): string | null {
    const authorization = headers["authorization"];
    if (authorization) {
      const [type, key] = authorization.split(" ");
      if (type === "ApiKey" && key) {
        return key;
      }
    }

    const apiKey = headers["x-api-key"];
    if (typeof apiKey === "string" && apiKey.length > 0) {
      return apiKey;
    }

    return null;
  }
}
