import { type WorkExperienceAttributes } from "../../entities/work-experience/work-experience.entity";

export type UpsertProfileWorkOutput = {
  workExperiences: WorkExperienceAttributes[];
};
