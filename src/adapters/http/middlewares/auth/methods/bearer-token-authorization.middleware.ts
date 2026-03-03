import { UnauthorizedError } from "../../../../../core/errors/auth.error";
import { BaseError } from "../../../../../core/errors/base.error";
import { type Logger } from "../../../../../core/ports/logger.port";
import { type TokenCryptor } from "../../../../../core/ports/token-cryptor.port";
import { type HttpMiddleware, type HttpContext } from "../../../http-adapter.port";

export class BearerTokenAuthorizationMiddleware implements HttpMiddleware {
  constructor(private readonly deps: { tokenCryptor: TokenCryptor; logger: Logger }) {}

  async handle(ctx: HttpContext): Promise<void> {
    const { logger } = this.deps;

    if (ctx.state?.isAuthenticated) {
      logger.info("Already authenticated, skipping bearer token check");
      return;
    }

    const request = ctx.request;
    try {
      const token = this.extractTokenFromHeader(request.headers);
      if (!token) {
        logger.warn("No bearer token found in request headers");
        throw new UnauthorizedError();
      }

      logger.info("Verifying bearer token");
      const payload = await this.deps.tokenCryptor.verify(token);

      logger.info("Bearer token authenticated successfully");
      ctx.state = {
        authType: "bearer",
        isAuthenticated: true,
        user: payload
      };
    } catch (error) {
      if (error instanceof BaseError) {
        logger.warn("Bearer token authorization failed");
        throw error;
      }
      logger.error({ error }, "Unexpected error during bearer token authorization");
      throw new UnauthorizedError();
    }
  }

  private extractTokenFromHeader(headers: any): string | null {
    const authorization = headers?.["authorization"]?.split(" "); // Bearer <token>
    if (!authorization) {
      return null;
    }
    const [type, token] = authorization;
    return type !== "Bearer" || !token ? null : token;
  }
}
