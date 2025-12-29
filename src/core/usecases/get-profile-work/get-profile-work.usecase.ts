import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileWorkOutput } from "./get-profile-work.output";

export type GetProfileWorkUseCasePort = UseCase<void, GetProfileWorkOutput>;

export class GetProfileWorkUseCase implements GetProfileWorkUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileWorkOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    if (!profile?.fields.id) {
      return { workExperiences: [] };
    }

    const workExperiences = await this.deps.uow.workExperience.findByProfileId(profile.fields.id);
    return { workExperiences: workExperiences.map((item) => item.fields) };
  }
}
