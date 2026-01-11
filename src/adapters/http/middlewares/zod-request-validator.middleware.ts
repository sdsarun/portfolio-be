import { type ZodType } from "zod";
import { type HttpContext, type HttpMiddleware } from "../http-adapter.port";
import { ValidationError } from "../../../core/errors/validation.error";

export type RequestSchemas = {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
};

export class ZodRequestValidatorMiddleware implements HttpMiddleware {
  constructor(private readonly schemas: RequestSchemas) {}

  async handle(ctx: HttpContext): Promise<void> {
    if (this.schemas.params) {
      const parsed = await this.schemas.params.safeParseAsync(ctx.request.params);
      if (!parsed.success) {
        throw new ValidationError({ issues: parsed.error.issues });
      }
      ctx.request.params = parsed.data;
    }

    if (this.schemas.query) {
      const parsed = await this.schemas.query.safeParseAsync(ctx.request.query);
      if (!parsed.success) {
        throw new ValidationError({ issues: parsed.error.issues });
      }
      ctx.request.query = parsed.data;
    }

    if (this.schemas.body) {
      const parsed = await this.schemas.body.safeParseAsync(ctx.request.body);
      if (!parsed.success) {
        throw new ValidationError({ issues: parsed.error.issues });
      }
      ctx.request.body = parsed.data;
    }
  }
}
