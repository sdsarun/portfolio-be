import { type HttpContext, type HttpRequestInput, type HttpMiddleware } from "../../http-adapter.port";

export type AccessMethod = "bearer" | "api-key";
export type AccessControlOptions = {
  methods: AccessMethod[];
};

class AccessControlControllerMiddleware implements HttpMiddleware {
  constructor(private readonly accessMethods: HttpMiddleware[]) {}

  async handle(ctx: HttpContext<HttpRequestInput, Record<string, any>>): Promise<void> {
    const errors: Error[] = [];
    for (const middleware of this.accessMethods) {
      try {
        await middleware.handle(ctx);
        return;
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length > 0) {
      throw errors.at(-1);
    }
  }
}

export class AccessControlMiddleware {
  constructor(private readonly deps: { accessMethods: Record<AccessMethod, HttpMiddleware> }) {}

  build({ methods }: AccessControlOptions): HttpMiddleware {
    const selected = methods.map((m) => this.deps.accessMethods[m]);
    return new AccessControlControllerMiddleware(selected);
  }
}
