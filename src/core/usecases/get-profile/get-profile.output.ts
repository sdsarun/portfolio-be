import { type CertificationAttributes } from "../../entities/certifications/certifications.entity";
import { type ContactAttributes } from "../../entities/contact/contact.entity";
import { type EducationAttributes } from "../../entities/education/education.entity";
import { type ProfileAttributes } from "../../entities/profile/profile.entity";
import { type ProjectExperienceAttributes } from "../../entities/project-experience/project-experience.entity";
import { type SkillAttributes } from "../../entities/skill/skill.entity";
import { type WorkExperienceAttributes } from "../../entities/work-experience/work-experience.entity";

export type GetProfileOutput = {
  profile: ProfileAttributes | null;
  workExperiences: WorkExperienceAttributes[];
  projectExperiences: ProjectExperienceAttributes[];
  skills: SkillAttributes[];
  education: EducationAttributes[];
  certification: CertificationAttributes[];
  contacts: ContactAttributes[];
};
