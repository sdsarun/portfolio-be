import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetApiKeysInput } from "./get-api-keys.input";
import { type GetApiKeysOutput } from "./get-api-keys.output";

export type GetApiKeysUseCasePort = UseCase<GetApiKeysInput, GetApiKeysOutput>;

export class GetApiKeysUseCase implements GetApiKeysUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
    }
  ) {}

  async execute(input: GetApiKeysInput): Promise<GetApiKeysOutput> {
    const { data, meta } = await this.deps.uow.apiKey.findPaginated(input);
    return {
      data: data.map((apiKey) => ({
        id: apiKey.fields.id!,
        status: apiKey.fields.revokedAt ? "revoked" : "active",
        createdAt: apiKey.fields.createdAt!.toISOString(),
        keyRef: apiKey.fields.keyRef!
      })),
      meta: {
        pagination: meta
      }
    };
  }
}
