import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { type UpdatePasswordDTO, updatePasswordInputDTOSchema } from "./update-password.dto";
import { type UpdatePasswordUseCasePort } from "../../../../../../core/usecases/update-password/update-password.usecase";

export type UpdatePasswordHandlerPort = HttpHandler<{ body: UpdatePasswordDTO }>;

export class UpdatePasswordHandler implements UpdatePasswordHandlerPort {
  constructor(private readonly updatePasswordUseCase: UpdatePasswordUseCasePort) {}

  async handle({ request }: HttpContext<{ body: UpdatePasswordDTO }>): Promise<HttpResponse> {
    const parsed = await updatePasswordInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const result = await this.updatePasswordUseCase.execute(parsed.data);
    return { success: true, statusCode: 200, data: result };
  }
}
