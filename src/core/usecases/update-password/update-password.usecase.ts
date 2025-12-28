import { type PasswordHasher } from "../../ports/password-hasher.port";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { InvalidOldPasswordError, MissingAuthDataError } from "../../errors/auth.error";
import { type UseCase } from "../base/base.usecase";
import { type UpdatePasswordInput } from "./update-password.input";
import { type UpdatePasswordOutput } from "./update-password.output";

export type UpdatePasswordUseCasePort = UseCase<UpdatePasswordInput, UpdatePasswordOutput>;

export class UpdatePasswordUseCase implements UpdatePasswordUseCasePort {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly passwordHasher: PasswordHasher,
    private readonly authId: string
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    const auth = await this.uow.auth.findById(this.authId);

    if (!auth?.fields.id || !auth.fields.hashPassword) {
      throw new MissingAuthDataError();
    }

    const isOldPasswordMatched = await this.passwordHasher.verify(
      input.oldPassword,
      auth.fields.hashPassword
    );
    if (!isOldPasswordMatched) {
      throw new InvalidOldPasswordError();
    }

    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);
    await this.uow.auth.updateById(auth.fields.id, { hashPassword: newPasswordHash });

    return { message: "Password updated" };
  }
}
