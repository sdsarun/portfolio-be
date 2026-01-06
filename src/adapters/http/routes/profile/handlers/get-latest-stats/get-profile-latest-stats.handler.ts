import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type GetProfileLatestUpdatedUseCasePort } from "../../../../../../core/usecases/profile-stats/get-profile-latest-updated.usecase";
import {
  type GetProfileLatestStatsQuery,
  getProfileLatestStatsQuerySchema
} from "./get-profile-latest-stats.dto";
import { ValidationError } from "../../../../../../core/errors/validation.error";

export type GetProfileLatestStatsHandlerPort = HttpHandler<{ query: GetProfileLatestStatsQuery }>;

export class GetProfileLatestStatsHandler implements HttpHandler {
  constructor(
    private readonly deps: { getProfileLatestUpdatedUseCase: GetProfileLatestUpdatedUseCasePort }
  ) {}

  async handle({ request }: HttpContext<{ query: GetProfileLatestStatsQuery }>): Promise<HttpResponse> {
    const parsed = await getProfileLatestStatsQuerySchema.safeParseAsync(request.query);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const groups = parsed.data.group;
    const result = await this.deps.getProfileLatestUpdatedUseCase.execute({ groups });

    return {
      statusCode: 200,
      data: result
    };
  }
}
