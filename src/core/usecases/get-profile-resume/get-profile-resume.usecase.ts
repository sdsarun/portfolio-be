import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileResumeOutput } from "./get-profile-resume.output";

export type GetProfileResumeUseCasePort = UseCase<void, GetProfileResumeOutput>;

export class GetProfileResumeUseCase implements GetProfileResumeUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileResumeOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    if (!profile?.fields.id) {
      return {
        profile: profile?.fields ?? null,
        workExperiences: [],
        skills: [],
        education: [],
        certification: []
      };
    }

    const profileId = profile.fields.id;

    const [workExperiences, skills, education, certification] = await Promise.all([
      this.deps.uow.workExperience.findByProfileId(profileId),
      this.deps.uow.skill.findByProfileId(profileId),
      this.deps.uow.education.findByProfileId(profileId),
      this.deps.uow.certification.findByProfileId(profileId)
    ]);

    return {
      profile: profile.fields,
      workExperiences: workExperiences.map((item) => item.fields),
      skills: skills.map((item) => item.fields),
      education: education.map((item) => item.fields),
      certification: certification.map((item) => item.fields)
    };
  }
}
