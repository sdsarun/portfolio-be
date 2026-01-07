import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type RevokeApiKeysOutput } from "../../../../../../core/usecases/revoke-api-keys/revoke-api-keys.output";
import { type RevokeApiKeysUseCasePort } from "../../../../../../core/usecases/revoke-api-keys/revoke-api-keys.usecase";
import { type HttpContext, type HttpResponse, type HttpHandler } from "../../../../http-adapter.port";
import { revokeApiKeysBodyDTOSchema, type RevokeApiKeysBodyDTO } from "./revoke-api-keys.dto";

export type RevokeApiKeysHandlerPort = HttpHandler<{ body: RevokeApiKeysBodyDTO }, RevokeApiKeysOutput>;

export class RevokeApiKeysHandler implements RevokeApiKeysHandlerPort {
  constructor(
    private readonly deps: {
      revokeApiKeysUseCase: RevokeApiKeysUseCasePort;
    }
  ) {}

  async handle(
    ctx: HttpContext<{ body: RevokeApiKeysBodyDTO }, Record<string, any>>
  ): Promise<HttpResponse<RevokeApiKeysOutput>> {
    const parsed = await revokeApiKeysBodyDTOSchema.safeParseAsync(ctx.request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.revokeApiKeysUseCase.execute(parsed.data);

    return {
      data: result,
      statusCode: 200
    };
  }
}
