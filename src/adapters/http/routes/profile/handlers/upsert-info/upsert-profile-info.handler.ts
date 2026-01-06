import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type UpsertProfileInfoUseCasePort } from "../../../../../../core/usecases/upsert-profile-info/upsert-profile-info.usecase";
import { UpsertProfileInfoDTO, upsertProfileInfoInputDTOSchema } from "./upsert-profile-info.dto";

export type UpsertProfileInfoHandlerPort = HttpHandler<{ body: UpsertProfileInfoDTO }>;

export class UpsertProfileInfoHandler implements UpsertProfileInfoHandlerPort {
  constructor(private readonly deps: { upsertProfileInfoUseCase: UpsertProfileInfoUseCasePort }) {}

  async handle({ request }: HttpContext<{ body: UpsertProfileInfoDTO }>): Promise<HttpResponse> {
    const parsed = await upsertProfileInfoInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.upsertProfileInfoUseCase.execute(parsed.data);

    return {
      statusCode: 200,
      data: result
    };
  }
}
