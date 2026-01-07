import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileUseCasePort } from "../../../../../../core/usecases/get-profile/get-profile.usecase";
import { type GetProfileOutput } from "../../../../../../core/usecases/get-profile/get-profile.output";

export type GetProfileHandlerPort = HttpHandler<any, GetProfileOutput>;

export class GetProfileHandler implements GetProfileHandlerPort {
  constructor(private readonly deps: { getProfileUseCase: GetProfileUseCasePort }) {}

  async handle(): Promise<HttpResponse<GetProfileOutput>> {
    const result = await this.deps.getProfileUseCase.execute();
    return {
      statusCode: 200,
      data: result
    };
  }
}
