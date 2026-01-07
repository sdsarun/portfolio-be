import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type CreateApiKeyOutput } from "../../../../../../core/usecases/create-api-key/create-api-key.output";
import { type CreateApiKeyUseCasePort } from "../../../../../../core/usecases/create-api-key/create-api-key.usecase";
import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type CreateApiKeyDTO, createApiKeyInputDTOSchema } from "./create-api-key.dto";

export type CreateApiKeyHandlerPort = HttpHandler<{ body: CreateApiKeyDTO }, CreateApiKeyOutput>;

export class CreateApiKeyHandler implements CreateApiKeyHandlerPort {
  constructor(
    private readonly deps: {
      createApiKeyUseCase: CreateApiKeyUseCasePort;
    }
  ) {}

  async handle(
    ctx: HttpContext<{ body: CreateApiKeyDTO }, Record<string, any>>
  ): Promise<HttpResponse<CreateApiKeyOutput>> {
    const parsed = await createApiKeyInputDTOSchema.safeParseAsync(ctx.request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.createApiKeyUseCase.execute(parsed.data);

    return {
      statusCode: 201,
      data: result
    };
  }
}
