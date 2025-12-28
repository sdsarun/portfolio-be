import { type WorkExperienceAttributes } from "../../entities/work-experience/work-experience.entity";

export type GetProfileWorkOutput = {
  workExperiences: WorkExperienceAttributes[];
};
