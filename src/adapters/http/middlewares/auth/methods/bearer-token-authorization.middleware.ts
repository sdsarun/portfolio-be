import { UnauthorizedError } from "../../../../../core/errors/auth.error";
import { BaseError } from "../../../../../core/errors/base.error";
import { type TokenCryptor } from "../../../../../core/ports/token-cryptor.port";
import { type HttpMiddleware, type HttpContext } from "../../../http-adapter.port";

export class BearerTokenAuthorizationMiddleware implements HttpMiddleware {
  constructor(private readonly deps: { tokenCryptor: TokenCryptor }) {}

  async handle(ctx: HttpContext): Promise<void> {
    if (ctx.state?.isAuthenticated) {
      return;
    }

    const request = ctx.request;
    try {
      const token = this.extractTokenFromHeader(request.headers);
      if (!token) {
        throw new UnauthorizedError();
      }
      const payload = await this.deps.tokenCryptor.verify(token);

      ctx.state = {
        authType: "bearer",
        isAuthenticated: true,
        user: payload
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
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
