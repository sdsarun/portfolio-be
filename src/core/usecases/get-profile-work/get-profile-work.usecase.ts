import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileWorkOutput } from "./get-profile-work.output";

export type GetProfileWorkUseCasePort = UseCase<void, GetProfileWorkOutput>;

export class GetProfileWorkUseCase implements GetProfileWorkUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork }) {}

  async execute(): Promise<GetProfileWorkOutput> {
    const workExperiences = await this.deps.uow.workExperience.findAll();
    return { workExperiences: workExperiences.map((item) => item.fields) };
  }
}
