import { type PasswordHasher } from "../../ports/password-hasher.port";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { InvalidOldPasswordError, MissingAuthDataError } from "../../errors/auth.error";
import { type UseCase } from "../base/base.usecase";
import { type UpdatePasswordInput } from "./update-password.input";
import { type UpdatePasswordOutput } from "./update-password.output";

export type UpdatePasswordUseCasePort = UseCase<UpdatePasswordInput, UpdatePasswordOutput>;

export class UpdatePasswordUseCase implements UpdatePasswordUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      passwordHasher: PasswordHasher;
      authId: string;
    }
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    const auth = await this.deps.uow.auth.findById(this.deps.authId);

    if (!auth?.fields.id || !auth.fields.hashPassword) {
      throw new MissingAuthDataError();
    }

    const isOldPasswordMatched = await this.deps.passwordHasher.verify(
      input.oldPassword,
      auth.fields.hashPassword
    );
    if (!isOldPasswordMatched) {
      throw new InvalidOldPasswordError();
    }

    const newPasswordHash = await this.deps.passwordHasher.hash(input.newPassword);
    await this.deps.uow.auth.updateById(auth.fields.id, { hashPassword: newPasswordHash });

    return { message: "Password updated" };
  }
}
