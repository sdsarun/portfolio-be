import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type UpsertProfileResumeInput } from "./upsert-profile-resume.input";
import { type UpsertProfileResumeOutput } from "./upsert-profile-resume.output";

export type UpsertProfileResumeUseCasePort = UseCase<
  UpsertProfileResumeInput,
  UpsertProfileResumeOutput
>;

export class UpsertProfileResumeUseCase implements UpsertProfileResumeUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork; authId: string }) {}

  async execute(input: UpsertProfileResumeInput): Promise<UpsertProfileResumeOutput> {
    const existing = await this.deps.uow.profile.findByAuthId(this.deps.authId);

    const profile =
      existing ??
      (await this.deps.uow.profile.create({
        authId: this.deps.authId
      }));

    const profileId = profile.fields.id!;

    const profileToReturn =
      input.resumeUrl === undefined
        ? profile
        : await this.deps.uow.profile.updateById(profileId, { resumeUrl: input.resumeUrl });

    // Touch related entities on resume update for consistency
    const now = new Date();
    const [workExperiences, skills, education, certifications] = await Promise.all([
      this.deps.uow.workExperience.findAll(),
      this.deps.uow.skill.findAll(),
      this.deps.uow.education.findAll(),
      this.deps.uow.certification.findAll()
    ]);

    const updates: Promise<unknown>[] = [];

    for (const item of workExperiences) {
      if (item.fields.profileId === profileId && item.fields.id) {
        updates.push(this.deps.uow.workExperience.updateById(item.fields.id, { updatedAt: now }));
      }
    }

    for (const item of skills) {
      if (item.fields.profileId === profileId && item.fields.id) {
        updates.push(this.deps.uow.skill.updateById(item.fields.id, { updatedAt: now }));
      }
    }

    for (const item of education) {
      if (item.fields.profileId === profileId && item.fields.id) {
        updates.push(this.deps.uow.education.updateById(item.fields.id, { updatedAt: now }));
      }
    }

    for (const item of certifications) {
      if (item.fields.profileId === profileId && item.fields.id) {
        updates.push(this.deps.uow.certification.updateById(item.fields.id, { updatedAt: now }));
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return { profile: profileToReturn.fields };
  }
}
