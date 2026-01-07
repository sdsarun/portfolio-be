import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type GetApiKeysInput } from "../../../../../../core/usecases/get-api-keys/get-api-keys.input";
import { type GetApiKeysOutput } from "../../../../../../core/usecases/get-api-keys/get-api-keys.output";
import { type GetApiKeysUseCasePort } from "../../../../../../core/usecases/get-api-keys/get-api-keys.usecase";
import { type HttpContext, type HttpResponse, type HttpHandler } from "../../../../http-adapter.port";
import { getApiKeysInputDTOSchema } from "./get-api-keys.dto";

export type GetApiKeysHandlerPort = HttpHandler<{ query: GetApiKeysInput }, GetApiKeysOutput>;

export class GetApiKeysHandler implements GetApiKeysHandlerPort {
  constructor(private readonly deps: { getApiKeysUseCase: GetApiKeysUseCasePort }) {}

  async handle(
    ctx: HttpContext<{ query: GetApiKeysInput }, Record<string, any>>
  ): Promise<HttpResponse<GetApiKeysOutput>> {
    const parsed = await getApiKeysInputDTOSchema.safeParseAsync(ctx.request.query);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.getApiKeysUseCase.execute(parsed.data);

    return {
      data: result,
      statusCode: 200
    };
  }
}
