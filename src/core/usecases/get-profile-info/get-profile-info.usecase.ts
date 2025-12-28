import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileInfoOutput } from "./get-profile-info.output";

export type GetProfileInfoUseCasePort = UseCase<void, GetProfileInfoOutput>;

export class GetProfileInfoUseCase implements GetProfileInfoUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork }) {}

  async execute(): Promise<GetProfileInfoOutput> {
    const profiles = await this.deps.uow.profile.findAll();
    return { profile: profiles?.[0]?.fields ?? null };
  }
}
