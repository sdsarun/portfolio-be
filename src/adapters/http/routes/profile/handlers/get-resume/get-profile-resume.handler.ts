import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileResumeUseCasePort } from "../../../../../../core/usecases/get-profile-resume/get-profile-resume.usecase";

export type GetProfileResumeHandlerPort = HttpHandler;

export class GetProfileResumeHandler implements HttpHandler {
  constructor(private readonly deps: { getProfileResumeUseCase: GetProfileResumeUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileResumeUseCase.execute();
    return {
      success: true,
      statusCode: 200,
      data: {
        profile: result.profile,
        workExperiences: result.workExperiences,
        skills: result.skills,
        education: result.education,
        certification: result.certification
      }
    };
  }
}
