import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileUseCasePort } from "../../../../../../core/usecases/get-profile/get-profile.usecase";

export type GetProfileHandlerPort = HttpHandler;

export class GetProfileHandler implements HttpHandler {
  constructor(private readonly deps: { getProfileUseCase: GetProfileUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileUseCase.execute();
    return {
      success: true,
      statusCode: 200,
      data: result
    };
  }
}
