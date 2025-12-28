import { ProjectExperience, ProjectExperienceAttributes } from "./project-experience.entity";

export type ProjectExperienceRepository = {
  create(attributes: Partial<ProjectExperienceAttributes>): Promise<ProjectExperience>;
  findById(id: string): Promise<ProjectExperience | null>;
  updateById(id: string, attributes: Partial<ProjectExperienceAttributes>): Promise<ProjectExperience>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<ProjectExperience[]>;
  upsert(attributes: Partial<ProjectExperienceAttributes>): Promise<ProjectExperience>;
};
