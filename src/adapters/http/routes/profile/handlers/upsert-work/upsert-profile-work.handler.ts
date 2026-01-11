import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpsertProfileWorkUseCasePort } from "../../../../../../core/usecases/upsert-profile-work/upsert-profile-work.usecase";
import { type UpsertProfileWorkBodyDTO } from "./upsert-profile-work.dto";
import { type UpsertProfileWorkOutput } from "../../../../../../core/usecases/upsert-profile-work/upsert-profile-work.output";

export type UpsertProfileWorkHandlerPort = HttpHandler<
  { body: UpsertProfileWorkBodyDTO },
  UpsertProfileWorkOutput
>;

export class UpsertProfileWorkHandler implements UpsertProfileWorkHandlerPort {
  constructor(private readonly deps: { upsertProfileWorkUseCase: UpsertProfileWorkUseCasePort }) {}

  async handle(ctx: HttpContext<{ body: UpsertProfileWorkBodyDTO }>): Promise<HttpResponse> {
    const result = await this.deps.upsertProfileWorkUseCase.execute(ctx.request.body!);

    return {
      statusCode: 200,
      data: result
    };
  }
}
