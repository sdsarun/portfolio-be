import { type WorkExperience, type WorkExperienceAttributes } from "./work-experience.entity";

export type WorkExperienceRepository = {
  create(attributes: Partial<WorkExperienceAttributes>): Promise<WorkExperience>;
  findById(id: string): Promise<WorkExperience | null>;
  updateById(id: string, attributes: Partial<WorkExperienceAttributes>): Promise<WorkExperience>;
  deleteById(id: string): Promise<void>;
  findByProfileId(profileId: string): Promise<WorkExperience[]>;
  findAll(): Promise<WorkExperience[]>;
  upsert(attributes: Partial<WorkExperienceAttributes>): Promise<WorkExperience>;
};
