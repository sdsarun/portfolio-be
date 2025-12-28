import { type HttpContext, type HttpMiddleware } from "../http-adapter.port";
import { type TokenCryptor } from "../../../core/ports/token-cryptor.port";
import { UnauthorizedError } from "../../../core/errors/auth.error";

export class RequiredTokenMiddleware implements HttpMiddleware {
  constructor(private readonly tokenCryptor: TokenCryptor) {}

  async handle(ctx: HttpContext): Promise<void> {
    const request = ctx.request;
    const authorization = request.headers["authorization"];
    if (!authorization) {
      throw new UnauthorizedError("Missing Authorization header");
    }

    try {
      const token = this.extractTokenFromHeader(request.headers);
      if (!token) {
        throw new UnauthorizedError("Missing bearer token");
      }
      const payload = await this.tokenCryptor.verify(token);

      // attach data to http context
      ctx.state = {
        user: payload
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
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
