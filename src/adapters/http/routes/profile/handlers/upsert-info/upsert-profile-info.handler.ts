import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpsertProfileInfoUseCasePort } from "../../../../../../core/usecases/upsert-profile-info/upsert-profile-info.usecase";
import { type UpsertProfileInfoBodyDTO } from "./upsert-profile-info.dto";
import { type UpsertProfileInfoOutput } from "../../../../../../core/usecases/upsert-profile-info/upsert-profile-info.output";

export type UpsertProfileInfoHandlerPort = HttpHandler<
  { body: UpsertProfileInfoBodyDTO },
  UpsertProfileInfoOutput
>;

export class UpsertProfileInfoHandler implements UpsertProfileInfoHandlerPort {
  constructor(private readonly deps: { upsertProfileInfoUseCase: UpsertProfileInfoUseCasePort }) {}

  async handle(ctx: HttpContext<{ body: UpsertProfileInfoBodyDTO }>): Promise<HttpResponse> {
    const result = await this.deps.upsertProfileInfoUseCase.execute(ctx.request.body!);

    return {
      statusCode: 200,
      data: result
    };
  }
}
