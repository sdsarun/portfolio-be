import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpdatePasswordBodyDTO, updatePasswordBodyDTOSchema } from "./update-password.dto";
import { type UpdatePasswordUseCasePort } from "../../../../../../core/usecases/update-password/update-password.usecase";
import { type UpdatePasswordOutput } from "../../../../../../core/usecases/update-password/update-password.output";

export type UpdatePasswordHandlerPort = HttpHandler<
  { body: UpdatePasswordBodyDTO },
  UpdatePasswordOutput
>;

export class UpdatePasswordHandler implements UpdatePasswordHandlerPort {
  constructor(private readonly deps: { updatePasswordUseCase: UpdatePasswordUseCasePort }) {}

  async handle(
    ctx: HttpContext<{ body: UpdatePasswordBodyDTO }, Record<string, any>>
  ): Promise<HttpResponse<UpdatePasswordOutput>> {
    const parsed = await updatePasswordBodyDTOSchema.safeParseAsync(ctx.request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }
    const result = await this.deps.updatePasswordUseCase.execute(parsed.data);
    return { statusCode: 200, data: result };
  }
}
