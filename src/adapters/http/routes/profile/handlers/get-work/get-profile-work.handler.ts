import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileWorkUseCasePort } from "../../../../../../core/usecases/get-profile-work/get-profile-work.usecase";

export type GetProfileWorkHandlerPort = HttpHandler;

export class GetProfileWorkHandler implements HttpHandler {
  constructor(private readonly deps: { getProfileWorkUseCase: GetProfileWorkUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileWorkUseCase.execute();
    return {
      statusCode: 200,
      data: { workExperiences: result.workExperiences }
    };
  }
}
