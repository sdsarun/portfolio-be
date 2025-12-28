import { type PasswordHasher } from "../../ports/password-hasher.port";
import { type TokenCryptor } from "../../ports/token-cryptor.port";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type SignInInput } from "./signin.input";
import { type SignInOutput } from "./signin.output";
import { InvalidCredentialsError, MissingAuthDataError } from "../../errors/auth.error";

export type SignInUseCasePort = UseCase<SignInInput, SignInOutput>;

export class SignInUseCase implements SignInUseCasePort {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenCryptor: TokenCryptor
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const hashPasswordRecords = await this.uow.auth.findAll();
    if (hashPasswordRecords.length === 0) {
      throw new MissingAuthDataError();
    }

    const [hashPasswordRecord] = hashPasswordRecords;

    const isValid = await this.passwordHasher.verify(
      input.password,
      hashPasswordRecord.fields.hashPassword!
    );

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const signedToken = await this.tokenCryptor.sign({
      id: hashPasswordRecord.fields.id
    });

    return {
      token: signedToken
    };
  }
}
