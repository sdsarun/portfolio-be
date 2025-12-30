import { FileStorageRepositoryPort } from "../../ports/file-storage-repository.port";
import { UseCase } from "../base/base.usecase";

export type ForDevelopmentOnlyUseCasePort = UseCase<{ payload: any }, void>;

export class ForDevelopmentOnlyUseCase implements ForDevelopmentOnlyUseCasePort {
  constructor(private readonly fileStorageRepository: FileStorageRepositoryPort) {}

  async execute(input: { payload: any }): Promise<any> {
    console.log(
      "[LOG] - for-development-only.usecase.ts:10 - ForDevelopmentOnlyUseCase - execute - input:",
      input
    );
    const result = await this.fileStorageRepository.upsertFile({} as any);
    console.log(
      "[LOG] - for-development-only.usecase.ts:9 - ForDevelopmentOnlyUseCase - execute - result:",
      result
    );
  }
}
