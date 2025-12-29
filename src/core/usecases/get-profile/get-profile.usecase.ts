import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileOutput } from "./get-profile.output";

export type GetProfileUseCasePort = UseCase<void, GetProfileOutput>;

export class GetProfileUseCase implements GetProfileUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    if (!profile?.fields.id) {
      return {
        profile: profile?.fields ?? null,
        workExperiences: [],
        projectExperiences: [],
        skills: [],
        education: [],
        certification: [],
        contacts: []
      };
    }

    const profileId = profile.fields.id;

    const [workExperiences, projects, skills, education, certification, contact] = await Promise.all([
      this.deps.uow.workExperience.findByProfileId(profileId),
      this.deps.uow.projectExperience.findByProfileId(profileId),
      this.deps.uow.skill.findByProfileId(profileId),
      this.deps.uow.education.findByProfileId(profileId),
      this.deps.uow.certification.findByProfileId(profileId),
      this.deps.uow.contact.findByProfileId(profileId)
    ]);

    return {
      profile: profile.fields,
      workExperiences: workExperiences.map((item) => item.fields),
      projectExperiences: projects.map((item) => item.fields),
      skills: skills.map((item) => item.fields),
      education: education.map((item) => item.fields),
      certification: certification.map((item) => item.fields),
      contacts: contact.map((item) => item.fields)
    };
  }
}
