import { type CertificationAttributes } from "../../entities/certifications/certifications.entity";
import { type EducationAttributes } from "../../entities/education/education.entity";
import { type ProfileAttributes } from "../../entities/profile/profile.entity";
import { type SkillAttributes } from "../../entities/skill/skill.entity";
import { type WorkExperienceAttributes } from "../../entities/work-experience/work-experience.entity";

export type UpsertProfileResumeOutput = {
  profile: ProfileAttributes | null;
  workExperiences: WorkExperienceAttributes[];
  skills: SkillAttributes[];
  education: EducationAttributes[];
  certification: CertificationAttributes[];
};
