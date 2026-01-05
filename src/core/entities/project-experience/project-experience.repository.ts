import { type ProjectExperience, type ProjectExperienceAttributes } from "./project-experience.entity";

export type ProjectExperienceRepository = {
  create(
    attributes: Partial<Omit<ProjectExperienceAttributes, "projectLinks">>
  ): Promise<ProjectExperience>;
  findById(id: string): Promise<ProjectExperience | null>;
  updateById(
    id: string,
    attributes: Partial<Omit<ProjectExperienceAttributes, "projectLinks">>
  ): Promise<ProjectExperience>;
  deleteById(id: string): Promise<void>;
  softDeleteByIds(id: string[]): Promise<void>;
  findByProfileId(profileId: string): Promise<ProjectExperience[]>;
  upsert(
    attributes: Partial<Omit<ProjectExperienceAttributes, "projectLinks">>
  ): Promise<ProjectExperience>;
};
