import { Scope } from "../../constants/scope.constant";
import { ApiKeyCreateFailedError } from "../../errors/api-key.errors";
import { BaseError } from "../../errors/base.error";
import { type ApiKeyGenerator } from "../../ports/api-key-generator.port";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type CreateApiKeyInput } from "./create-api-key.input";
import { type CreateApiKeyOutput } from "./create-api-key.output";

export type CreateApiKeyUseCasePort = UseCase<CreateApiKeyInput, CreateApiKeyOutput>;

export class CreateApiKeyUseCase implements CreateApiKeyUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      apiKeyGenerator: ApiKeyGenerator;
    }
  ) {}

  async execute(input: CreateApiKeyInput): Promise<CreateApiKeyOutput> {
    return this.deps.uow.runInTransaction(async (uow) => {
      try {
        const { plaintext, hashed, keyRef } = await this.deps.apiKeyGenerator.generate();
        await uow.apiKey.create({
          name: input.name,
          hashedKey: hashed,
          keyRef,
          scope: Scope.GOD
        });
        return {
          apiKey: plaintext
        };
      } catch (error) {
        if (error instanceof BaseError) {
          throw error;
        }
        throw new ApiKeyCreateFailedError(error instanceof Error ? error.message : undefined);
      }
    });
  }
}
