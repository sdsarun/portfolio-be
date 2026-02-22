import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileWorkUseCasePort } from "../../../../../../core/usecases/get-profile-work/get-profile-work.usecase";
import { type GetProfileWorkOutput } from "../../../../../../core/usecases/get-profile-work/get-profile-work.output";

export type GetProfileWorkHandlerPort = HttpHandler<any, GetProfileWorkOutput>;

export class GetProfileWorkHandler implements GetProfileWorkHandlerPort {
  constructor(private readonly deps: { getProfileWorkUseCase: GetProfileWorkUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileWorkUseCase.execute();
    return {
      statusCode: 200,
      data: { projectExperiences: result.projectExperiences }
    };
  }
}
