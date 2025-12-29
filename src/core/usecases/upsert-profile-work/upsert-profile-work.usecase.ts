import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type UpsertProfileWorkInput } from "./upsert-profile-work.input";
import { type UpsertProfileWorkOutput } from "./upsert-profile-work.output";
import { type WorkExperience } from "../../entities/work-experience/work-experience.entity";

export type UpsertProfileWorkUseCasePort = UseCase<UpsertProfileWorkInput, UpsertProfileWorkOutput>;

export class UpsertProfileWorkUseCase implements UpsertProfileWorkUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork; authId: string }) {}

  async execute(input: UpsertProfileWorkInput): Promise<UpsertProfileWorkOutput> {
    return this.deps.uow.runInTransaction(async (uow) => {
      let profile = await uow.profile.findByAuthId(this.deps.authId);
      if (!profile) {
        profile = await uow.profile.create({ authId: this.deps.authId });
      }

      const profileId = profile.fields.id!;

      const existingForProfile = await uow.workExperience.findByProfileId(profileId);

      // If no payload provided, return current data.
      if (!input.workExperiences) {
        return { workExperiences: existingForProfile.map((item) => item.fields) };
      }

      const keptIds = new Set<string>();
      const saved: WorkExperience[] = [];

      for (const [index, item] of input.workExperiences.entries()) {
        const current = item.id
          ? existingForProfile.find((existingItem) => existingItem.fields.id === item.id)
          : undefined;

        const record = await uow.workExperience.upsert({
          id: item.id,
          profileId,
          jobTitle: item.jobTitle !== undefined ? item.jobTitle : (current?.fields.jobTitle ?? null),
          companyName:
            item.companyName !== undefined ? item.companyName : (current?.fields.companyName ?? null),
          startDate: item.startDate !== undefined ? item.startDate : (current?.fields.startDate ?? null),
          endDate: item.endDate !== undefined ? item.endDate : (current?.fields.endDate ?? null),
          isCurrent: item.isCurrent !== undefined ? item.isCurrent : (current?.fields.isCurrent ?? null),
          description:
            item.description !== undefined ? item.description : (current?.fields.description ?? null),
          displayOrder: item.displayOrder ?? current?.fields.displayOrder ?? index + 1
        });
        if (record.fields.id) {
          keptIds.add(record.fields.id);
        }
        saved.push(record);
      }

      const toDelete = existingForProfile
        .map((item) => item.fields.id)
        .filter((id): id is string => typeof id === "string" && !keptIds.has(id));

      await Promise.all(toDelete.map((id) => uow.workExperience.deleteById(id)));

      return { workExperiences: saved.map((item) => item.fields) };
    });
  }
}
