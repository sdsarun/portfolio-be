import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileInfoUseCasePort } from "../../../../../../core/usecases/get-profile-info/get-profile-info.usecase";
import { type GetProfileInfoOutput } from "../../../../../../core/usecases/get-profile-info/get-profile-info.output";

export type GetProfileInfoHandlerPort = HttpHandler<any, GetProfileInfoOutput>;

export class GetProfileInfoHandler implements GetProfileInfoHandlerPort {
  constructor(private readonly deps: { getProfileInfoUseCase: GetProfileInfoUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileInfoUseCase.execute();
    return {
      statusCode: 200,
      data: { profile: result.profile }
    };
  }
}
