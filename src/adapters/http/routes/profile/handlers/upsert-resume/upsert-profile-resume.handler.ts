import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpsertProfileResumeUseCasePort } from "../../../../../../core/usecases/upsert-profile-resume/upsert-profile-resume.usecase";
import { type UpsertProfileResumeBodyDTO } from "./upsert-profile-resume.dto";
import { type UpsertProfileResumeOutput } from "../../../../../../core/usecases/upsert-profile-resume/upsert-profile-resume.output";

export type UpsertProfileResumeHandlerPort = HttpHandler<
  { body: UpsertProfileResumeBodyDTO },
  UpsertProfileResumeOutput
>;

export class UpsertProfileResumeHandler implements UpsertProfileResumeHandlerPort {
  constructor(private readonly deps: { upsertProfileResumeUseCase: UpsertProfileResumeUseCasePort }) {}

  async handle(ctx: HttpContext<{ body: UpsertProfileResumeBodyDTO }>): Promise<HttpResponse> {
    const result = await this.deps.upsertProfileResumeUseCase.execute(ctx.request.body!);

    return {
      statusCode: 200,
      data: result
    };
  }
}
