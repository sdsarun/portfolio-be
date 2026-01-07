import { ApiKeyRevokeFailedError } from "../../errors/api-key.errors";
import { BaseError } from "../../errors/base.error";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type RevokeApiKeysInput } from "./revoke-api-keys.input";
import { type RevokeApiKeysOutput } from "./revoke-api-keys.output";

export type RevokeApiKeysUseCasePort = UseCase<RevokeApiKeysInput, RevokeApiKeysOutput>;

export class RevokeApiKeysUseCase implements RevokeApiKeysUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
    }
  ) {}

  async execute(input: RevokeApiKeysInput): Promise<RevokeApiKeysOutput> {
    return this.deps.uow.runInTransaction(async (uow) => {
      try {
        const output: RevokeApiKeysOutput = {
          revoked: [],
          failed: []
        };

        for (const apiKeyId of input.ids) {
          const apiKeyToRevoke = await uow.apiKey.findById(apiKeyId);
          if (!apiKeyToRevoke || apiKeyToRevoke.fields.revokedAt) {
            output.failed.push(apiKeyId);
            continue;
          }

          await uow.apiKey.revokeByIds([apiKeyId]);
          output.revoked.push(apiKeyId);
        }

        return output;
      } catch (error) {
        if (error instanceof BaseError) {
          throw error;
        }
        throw new ApiKeyRevokeFailedError(error instanceof Error ? error.message : undefined);
      }
    });
  }
}
