import { ApiKeyDeleteFailedError, ApiKeyNotFoundError } from "../../errors/api-key.errors";
import { BaseError } from "../../errors/base.error";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type DeleteApiKeyByIdInput } from "./delete-api-key-by-id.input";
import { type DeleteApiKeyByIdOutput } from "./delete-api-key-by-id.output";

export type DeleteApiKeyByIdUseCasePort = UseCase<DeleteApiKeyByIdInput, DeleteApiKeyByIdOutput>;

export class DeleteApiKeyByIdUseCase implements DeleteApiKeyByIdUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
    }
  ) {}

  async execute(input: DeleteApiKeyByIdInput): Promise<void> {
    return this.deps.uow.runInTransaction(async (uow) => {
      try {
        const apiKeyToDelete = await uow.apiKey.findById(input.id);
        if (!apiKeyToDelete) {
          throw new ApiKeyNotFoundError();
        }

        await uow.apiKey.softDeleteById(input.id);
      } catch (error) {
        if (error instanceof BaseError) {
          throw error;
        }
        throw new ApiKeyDeleteFailedError(error instanceof Error ? error.message : undefined);
      }
    });
  }
}
