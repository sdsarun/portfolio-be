import {
  type HttpContext,
  type HttpHandler,
  type HttpResponse
} from "../../../../http-adapter.port";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import {
  type UpsertProfileResumeUseCasePort
} from "../../../../../../core/usecases/upsert-profile/upsert-profile-resume.usecase";
import {
  UpsertProfileResumeDTO,
  upsertProfileResumeInputDTOSchema
} from "./upsert-profile-resume.dto";

export type UpsertProfileResumeHandlerPort = HttpHandler<{ body: UpsertProfileResumeDTO }>;

export class UpsertProfileResumeHandler implements UpsertProfileResumeHandlerPort {
  constructor(private readonly deps: { upsertProfileResumeUseCase: UpsertProfileResumeUseCasePort }) {}

  async handle({ request }: HttpContext<{ body: UpsertProfileResumeDTO }>): Promise<HttpResponse> {
    const parsed = await upsertProfileResumeInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.upsertProfileResumeUseCase.execute(parsed.data);

    return {
      success: true,
      statusCode: 200,
      data: result
    };
  }
}
