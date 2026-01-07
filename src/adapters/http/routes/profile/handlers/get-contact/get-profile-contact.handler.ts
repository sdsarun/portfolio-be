import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileContactUseCasePort } from "../../../../../../core/usecases/get-profile-contact/get-profile-contact.usecase";
import { type GetProfileContactOutput } from "../../../../../../core/usecases/get-profile-contact/get-profile-contact.output";

export type GetProfileContactHandlerPort = HttpHandler<any, GetProfileContactOutput>;

export class GetProfileContactHandler implements GetProfileContactHandlerPort {
  constructor(private readonly deps: { getProfileContactUseCase: GetProfileContactUseCasePort }) {}

  async handle(): Promise<HttpResponse> {
    const result = await this.deps.getProfileContactUseCase.execute();
    return {
      statusCode: 200,
      data: { contacts: result.contacts }
    };
  }
}
