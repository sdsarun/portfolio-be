import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileResumeOutput } from "./get-profile-resume.output";

export type GetProfileResumeUseCasePort = UseCase<void, GetProfileResumeOutput>;

export class GetProfileResumeUseCase implements GetProfileResumeUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork }) {}

  async execute(): Promise<GetProfileResumeOutput> {
    const [profiles, workExperiences, skills, education, certification] = await Promise.all([
      this.deps.uow.profile.findAll(),
      this.deps.uow.workExperience.findAll(),
      this.deps.uow.skill.findAll(),
      this.deps.uow.education.findAll(),
      this.deps.uow.certification.findAll()
    ]);

    return {
      profile: profiles?.[0]?.fields ?? null,
      workExperiences: workExperiences.map((item) => item.fields),
      skills: skills.map((item) => item.fields),
      education: education.map((item) => item.fields),
      certification: certification.map((item) => item.fields)
    };
  }
}
