import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileOutput } from "./get-profile.output";

export type GetProfileUseCasePort = UseCase<void, GetProfileOutput>;

export class GetProfileUseCase implements GetProfileUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork }) {}

  async execute(): Promise<GetProfileOutput> {
    const [profiles, workExperiences, projects, skills, education, certification, contact] =
      await Promise.all([
        this.deps.uow.profile.findAll(),
        this.deps.uow.workExperience.findAll(),
        this.deps.uow.projectExperience.findAll(),
        this.deps.uow.skill.findAll(),
        this.deps.uow.education.findAll(),
        this.deps.uow.certification.findAll(),
        this.deps.uow.contact.findAll()
      ]);

    return {
      profile: profiles?.[0]?.fields ?? null,
      workExperiences: workExperiences.map((item) => item.fields),
      projectExperiences: projects.map((item) => item.fields),
      skills: skills.map((item) => item.fields),
      education: education.map((item) => item.fields),
      certification: certification.map((item) => item.fields),
      contacts: contact.map((item) => item.fields)
    };
  }
}
