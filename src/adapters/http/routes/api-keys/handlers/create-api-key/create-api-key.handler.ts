import { type CreateApiKeyOutput } from "../../../../../../core/usecases/create-api-key/create-api-key.output";
import { type CreateApiKeyUseCasePort } from "../../../../../../core/usecases/create-api-key/create-api-key.usecase";
import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type CreateApiKeyBodyDTO } from "./create-api-key.dto";

export type CreateApiKeyHandlerPort = HttpHandler<{ body: CreateApiKeyBodyDTO }, CreateApiKeyOutput>;

export class CreateApiKeyHandler implements CreateApiKeyHandlerPort {
  constructor(
    private readonly deps: {
      createApiKeyUseCase: CreateApiKeyUseCasePort;
    }
  ) {}

  async handle(
    ctx: HttpContext<{ body: CreateApiKeyBodyDTO }, Record<string, any>>
  ): Promise<HttpResponse<CreateApiKeyOutput>> {
    const result = await this.deps.createApiKeyUseCase.execute(ctx.request.body!);

    return {
      statusCode: 201,
      data: result
    };
  }
}
