import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileContactUseCasePort } from "../../../../../../core/usecases/get-profile-contact/get-profile-contact.usecase";

export type GetProfileContactHandlerPort = HttpHandler;

export class GetProfileContactHandler implements HttpHandler {
  constructor(private readonly deps: { getProfileContactUseCase: GetProfileContactUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileContactUseCase.execute();
    return {
      success: true,
      statusCode: 200,
      data: { contacts: result.contacts }
    };
  }
}
