import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileInfoUseCasePort } from "../../../../../../core/usecases/get-profile-info/get-profile-info.usecase";

export type GetProfileInfoHandlerPort = HttpHandler;

export class GetProfileInfoHandler implements HttpHandler {
  constructor(private readonly deps: { getProfileInfoUseCase: GetProfileInfoUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileInfoUseCase.execute();
    return {
      success: true,
      statusCode: 200,
      data: { profile: result.profile }
    };
  }
}
