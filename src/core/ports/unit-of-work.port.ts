import { type ApiKeyRepository } from "../entities/api-key/api-key.repository";
import { type AttachmentRepository } from "../entities/attachment/attachment.repository";
import { type AuthRepository } from "../entities/auth/auth.repository";
import { type CertificationRepository } from "../entities/certifications/certification.repository";
import { type ContactRepository } from "../entities/contact/contact.repository";
import { type EducationRepository } from "../entities/education/education.repository";
import { type ProfileRepository } from "../entities/profile/profile.repository";
import { type ProjectExperienceAttachmentRepository } from "../entities/project-experience-attachment/project-experience-attachment.repository";
import { type ProjectExperienceRepository } from "../entities/project-experience/project-experience.repository";
import { type ProjectLinkRepository } from "../entities/project-link/project-link.repository";
import { type SkillRepository } from "../entities/skill/skill.repository";
import { type WorkExperienceRepository } from "../entities/work-experience/work-experience.repository";

export type TransactionalUnitOfWork = Omit<UnitOfWork, "runInTransaction">;
export type UnitOfWork = {
  auth: AuthRepository;
  profile: ProfileRepository;
  workExperience: WorkExperienceRepository;
  skill: SkillRepository;
  education: EducationRepository;
  certification: CertificationRepository;
  projectExperience: ProjectExperienceRepository;
  projectLink: ProjectLinkRepository;
  contact: ContactRepository;
  attachment: AttachmentRepository;
  projectExperienceAttachment: ProjectExperienceAttachmentRepository;
  apiKey: ApiKeyRepository;
  runInTransaction<T>(handler: (uow: TransactionalUnitOfWork) => Promise<T>): Promise<T>;
};
