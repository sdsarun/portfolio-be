import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpsertProfileWorkUseCasePort } from "../../../../../../core/usecases/upsert-profile-work/upsert-profile-work.usecase";
import {
  type UpsertProfileWorkBodyDTO,
  upsertProfileWorkBodyDTOSchema
} from "./upsert-profile-work.dto";
import { type UpsertProfileWorkOutput } from "../../../../../../core/usecases/upsert-profile-work/upsert-profile-work.output";

export type UpsertProfileWorkHandlerPort = HttpHandler<
  { body: UpsertProfileWorkBodyDTO },
  UpsertProfileWorkOutput
>;

export class UpsertProfileWorkHandler implements UpsertProfileWorkHandlerPort {
  constructor(private readonly deps: { upsertProfileWorkUseCase: UpsertProfileWorkUseCasePort }) {}

  async handle({ request }: HttpContext<{ body: UpsertProfileWorkBodyDTO }>): Promise<HttpResponse> {
    const parsed = await upsertProfileWorkBodyDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.deps.upsertProfileWorkUseCase.execute(parsed.data);

    return {
      statusCode: 200,
      data: result
    };
  }
}
