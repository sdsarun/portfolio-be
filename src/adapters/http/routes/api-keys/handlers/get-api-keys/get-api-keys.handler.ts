import { type GetApiKeysInput } from "../../../../../../core/usecases/get-api-keys/get-api-keys.input";
import { type GetApiKeysOutput } from "../../../../../../core/usecases/get-api-keys/get-api-keys.output";
import { type GetApiKeysUseCasePort } from "../../../../../../core/usecases/get-api-keys/get-api-keys.usecase";
import { type HttpContext, type HttpResponse, type HttpHandler } from "../../../../http-adapter.port";

export type GetApiKeysHandlerPort = HttpHandler<{ query: GetApiKeysInput }, GetApiKeysOutput>;

export class GetApiKeysHandler implements GetApiKeysHandlerPort {
  constructor(private readonly deps: { getApiKeysUseCase: GetApiKeysUseCasePort }) {}

  async handle(
    ctx: HttpContext<{ query: GetApiKeysInput }, Record<string, any>>
  ): Promise<HttpResponse<GetApiKeysOutput>> {
    const result = await this.deps.getApiKeysUseCase.execute(ctx.request.query!);

    return {
      data: result,
      statusCode: 200
    };
  }
}
