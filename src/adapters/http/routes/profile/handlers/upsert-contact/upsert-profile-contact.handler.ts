import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpsertProfileContactUseCasePort } from "../../../../../../core/usecases/upsert-profile-contact/upsert-profile-contact.usecase";
import { type UpsertProfileContactBodyDTO } from "./upsert-profile-contact.dto";
import { type UpsertProfileContactOutput } from "../../../../../../core/usecases/upsert-profile-contact/upsert-profile-contact.output";

export type UpsertProfileContactHandlerPort = HttpHandler<
  { body: UpsertProfileContactBodyDTO },
  UpsertProfileContactOutput
>;

export class UpsertProfileContactHandler implements UpsertProfileContactHandlerPort {
  constructor(private readonly deps: { upsertProfileContactUseCase: UpsertProfileContactUseCasePort }) {}

  async handle(ctx: HttpContext<{ body: UpsertProfileContactBodyDTO }>): Promise<HttpResponse> {
    const result = await this.deps.upsertProfileContactUseCase.execute(ctx.request.body!);

    return {
      statusCode: 200,
      data: result
    };
  }
}
