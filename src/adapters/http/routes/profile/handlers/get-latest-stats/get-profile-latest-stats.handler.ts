import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileLatestUpdatedUseCasePort } from "../../../../../../core/usecases/profile-stats/get-profile-latest-updated.usecase";
import { type GetProfileLatestStatusQueryDTO } from "./get-profile-latest-stats.dto";
import { type GetProfileLatestUpdatedOutput } from "../../../../../../core/usecases/profile-stats/get-profile-latest-updated.output";

export type GetProfileLatestStatusHandlerPort = HttpHandler<
  { query: GetProfileLatestStatusQueryDTO },
  GetProfileLatestUpdatedOutput
>;

export class GetProfileLatestStatusHandler implements GetProfileLatestStatusHandlerPort {
  constructor(
    private readonly deps: { getProfileLatestUpdatedUseCase: GetProfileLatestUpdatedUseCasePort }
  ) {}

  async handle(
    ctx: HttpContext<{ query: GetProfileLatestStatusQueryDTO }, Record<string, any>>
  ): Promise<HttpResponse<GetProfileLatestUpdatedOutput>> {
    const groups = ctx.request.query?.group;
    const result = await this.deps.getProfileLatestUpdatedUseCase.execute({ groups });

    return {
      data: result,
      statusCode: 200
    };
  }
}
