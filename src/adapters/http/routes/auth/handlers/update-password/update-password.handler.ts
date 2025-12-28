import { PasswordHasher } from "../../../../../../core/ports/password-hasher.port";
import { InvalidOldPasswordError, MissingAuthDataError } from "../../../../../../core/errors/auth.error";
import { ValidationError } from "../../../../../../core/errors/validation.error";
import { type UnitOfWork } from "../../../../../../core/ports/unit-of-work.port";
import { env } from "../../../../../../infrastructure/env/env.config";
import { type HttpContext, type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import { UpdatePasswordDTO, updatePasswordInputDTOSchema } from "./update-password.dto";

export class UpdatePasswordHandler implements HttpHandler<{ body: UpdatePasswordDTO }> {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async handle({ request }: HttpContext<{ body: UpdatePasswordDTO }>): Promise<HttpResponse> {
    const parsed = await updatePasswordInputDTOSchema.safeParseAsync(request.body);
    if (!parsed.success) {
      throw new ValidationError({ issues: parsed.error.issues });
    }

    const { oldPassword, newPassword } = parsed.data;

    const auth = await this.uow.auth.findById(env.AUTH_ID);

    if (!auth?.fields.id || !auth.fields.hashPassword) {
      throw new MissingAuthDataError();
    }

    const isOldPasswordMatched = await this.passwordHasher.verify(oldPassword, auth.fields.hashPassword);
    if (!isOldPasswordMatched) {
      throw new InvalidOldPasswordError();
    }

    const newPasswordHash = await this.passwordHasher.hash(newPassword);
    await this.uow.auth.updateById(auth.fields.id, { hashPassword: newPasswordHash });
    return { success: true, statusCode: 200, data: { message: "Password updated" } };
  }
}
