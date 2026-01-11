import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpdatePasswordBodyDTO } from "./update-password.dto";
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
    const result = await this.deps.updatePasswordUseCase.execute(ctx.request.body!);
    return { statusCode: 200, data: result };
  }
}
