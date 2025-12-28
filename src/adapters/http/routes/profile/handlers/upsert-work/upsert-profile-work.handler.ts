import {
  type HttpContext,
  type HttpHandler,
  type HttpResponse
} from "../../../../http-adapter.port";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import {
  type UpsertProfileWorkUseCasePort
} from "../../../../../../core/usecases/upsert-profile/upsert-profile-work.usecase";
import {
  UpsertProfileWorkDTO,
  upsertProfileWorkInputDTOSchema
} from "./upsert-profile-work.dto";

export type UpsertProfileWorkHandlerPort = HttpHandler<{ body: UpsertProfileWorkDTO }>;

export class UpsertProfileWorkHandler implements UpsertProfileWorkHandlerPort {
  constructor(private readonly deps: { upsertProfileWorkUseCase: UpsertProfileWorkUseCasePort }) {}

  async handle({ request }: HttpContext<{ body: UpsertProfileWorkDTO }>): Promise<HttpResponse> {
    const parsed = await upsertProfileWorkInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.upsertProfileWorkUseCase.execute(parsed.data);

    return {
      success: true,
      statusCode: 200,
      data: result
    };
  }
}
