import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileInfoOutput } from "./get-profile-info.output";

export type GetProfileInfoUseCasePort = UseCase<void, GetProfileInfoOutput>;

export class GetProfileInfoUseCase implements GetProfileInfoUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileInfoOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    return { profile: profile?.fields ?? null };
  }
}
