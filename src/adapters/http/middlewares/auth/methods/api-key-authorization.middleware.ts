import { UnauthorizedError } from "../../../../../core/errors/auth.error";
import { type Hasher } from "../../../../../core/ports/hasher.port";
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
    }
  ) {}

  async handle(ctx: HttpContext<HttpRequestInput, Record<string, any>>): Promise<void> {
    if (ctx.state?.isAuthenticated) {
      return;
    }

    const request = ctx.request;
    try {
      const apiKey = this.extractApiKeyFromHeader(request.headers);
      if (!apiKey) {
        throw new UnauthorizedError();
      }

      const hashedKey = await this.deps.sha256Hasher.hash(apiKey);
      const payload = await this.deps.uow.apiKey.findByHashedKey(hashedKey);

      if (!payload) {
        throw new UnauthorizedError();
      }

      ctx.state = {
        authType: "apikey",
        isAuthenticated: true,
        apiKey: {
          id: payload?.fields.id,
          name: payload?.fields.name,
          scope: payload?.fields.scope
        }
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
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
