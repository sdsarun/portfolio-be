import { type ProfileAttributes } from "../../entities/profile/profile.entity";
import { type WorkExperienceAttributes } from "../../entities/work-experience/work-experience.entity";
import { type SkillAttributes } from "../../entities/skill/skill.entity";
import { type EducationAttributes } from "../../entities/education/education.entity";
import { type CertificationAttributes } from "../../entities/certifications/certifications.entity";

export type GetProfileResumeOutput = {
  profile: ProfileAttributes | null;
  workExperiences: WorkExperienceAttributes[];
  skills: SkillAttributes[];
  education: EducationAttributes[];
  certification: CertificationAttributes[];
};
