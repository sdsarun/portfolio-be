import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type DeleteApiKeyByIdOutput } from "../../../../../../core/usecases/delete-api-key-by-id/delete-api-key-by-id.output";
import { type DeleteApiKeyByIdUseCasePort } from "../../../../../../core/usecases/delete-api-key-by-id/delete-api-key-by-id.usecase";
import { HttpContext, HttpResponse, type HttpHandler } from "../../../../http-adapter.port";
import {
  deleteApiKeyByIdParamsDTOSchema,
  type DeleteApiKeyByIdParamsDTO
} from "./delete-api-key-by-id.dto";

export type DeleteApiKeyByIdHandlerPort = HttpHandler<
  { params: DeleteApiKeyByIdParamsDTO },
  DeleteApiKeyByIdOutput
>;

export class DeleteApiKeyByIdHandler implements DeleteApiKeyByIdHandlerPort {
  constructor(
    private readonly deps: {
      deleteApiKeyByIdUseCase: DeleteApiKeyByIdUseCasePort;
    }
  ) {}

  async handle(
    ctx: HttpContext<{ params: DeleteApiKeyByIdParamsDTO }, Record<string, any>>
  ): Promise<HttpResponse<void>> {
    const parsed = await deleteApiKeyByIdParamsDTOSchema.safeParseAsync(ctx.request.params);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    await this.deps.deleteApiKeyByIdUseCase.execute(parsed.data);

    return {
      statusCode: 204
    };
  }
}
