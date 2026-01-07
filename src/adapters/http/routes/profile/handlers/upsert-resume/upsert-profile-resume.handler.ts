import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpsertProfileResumeUseCasePort } from "../../../../../../core/usecases/upsert-profile-resume/upsert-profile-resume.usecase";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import {
  type UpsertProfileResumeBodyDTO,
  upsertProfileResumeBodyDTOSchema
} from "./upsert-profile-resume.dto";
import { type UpsertProfileResumeOutput } from "../../../../../../core/usecases/upsert-profile-resume/upsert-profile-resume.output";

export type UpsertProfileResumeHandlerPort = HttpHandler<
  { body: UpsertProfileResumeBodyDTO },
  UpsertProfileResumeOutput
>;

export class UpsertProfileResumeHandler implements UpsertProfileResumeHandlerPort {
  constructor(private readonly deps: { upsertProfileResumeUseCase: UpsertProfileResumeUseCasePort }) {}

  async handle({ request }: HttpContext<{ body: UpsertProfileResumeBodyDTO }>): Promise<HttpResponse> {
    const parsed = await upsertProfileResumeBodyDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.upsertProfileResumeUseCase.execute(parsed.data);

    return {
      statusCode: 200,
      data: result
    };
  }
}
