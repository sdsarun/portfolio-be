import { CertificationAttributes } from "../../entities/certifications/certifications.entity";
import { EducationAttributes } from "../../entities/education/education.entity";
import { SkillAttributes } from "../../entities/skill/skill.entity";
import { type WorkExperienceAttributes } from "../../entities/work-experience/work-experience.entity";

export type UpsertProfileResumeInput = {
  workExperiences?: Partial<Omit<WorkExperienceAttributes, "profileId" | "updatedAt" | "deletedAt">>[];
  skills?: Partial<Omit<SkillAttributes, "profileId" | "updatedAt" | "deletedAt">>[];
  education?: Partial<Omit<EducationAttributes, "profileId" | "updatedAt" | "deletedAt">>[];
  certification?: Partial<Omit<CertificationAttributes, "profileId" | "updatedAt" | "deletedAt">>[];
  resumeUrl?: string | null;
};
