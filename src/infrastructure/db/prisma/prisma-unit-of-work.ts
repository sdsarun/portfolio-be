import { type AuthRepository } from "../../../core/entities/auth/auth.repository";
import { type CertificationRepository } from "../../../core/entities/certifications/certification.repository";
import { type ContactRepository } from "../../../core/entities/contact/contact.repository";
import { type EducationRepository } from "../../../core/entities/education/education.repository";
import { type ProfileRepository } from "../../../core/entities/profile/profile.repository";
import { type ProjectExperienceRepository } from "../../../core/entities/project-experience/project-experience.repository";
import { type ProjectLinkRepository } from "../../../core/entities/project-link/project-link.repository";
import { type SkillRepository } from "../../../core/entities/skill/skill.repository";
import { type WorkExperienceRepository } from "../../../core/entities/work-experience/work-experience.repository";
import { type UnitOfWork, type TransactionalUnitOfWork } from "../../../core/ports/unit-of-work.port";
import { type PrismaClientOrTransaction } from "./prisma-database-session";
import { PrismaAuthRepository } from "./repositories/prisma-auth.repository";
import { PrismaCertificationRepository } from "./repositories/prisma-certification.repository";
import { PrismaContactRepository } from "./repositories/prisma-contact.repository";
import { PrismaEducationRepository } from "./repositories/prisma-education.repository";
import { PrismaProfileRepository } from "./repositories/prisma-profile.repository";
import { PrismaProjectExperienceRepository } from "./repositories/prisma-project-experience.repository";
import { PrismaProjectLinkRepository } from "./repositories/prisma-project-link.repository";
import { PrismaSkillRepository } from "./repositories/prisma-skill.repository";
import { PrismaWorkExperienceRepository } from "./repositories/prisma-work-experience.repository";

export class PrismaUnitOfWork implements UnitOfWork {
  public readonly auth: AuthRepository;
  public readonly profile: ProfileRepository;
  public readonly workExperience: WorkExperienceRepository;
  public readonly skill: SkillRepository;
  public readonly education: EducationRepository;
  public readonly certification: CertificationRepository;
  public readonly projectExperience: ProjectExperienceRepository;
  public readonly projectLink: ProjectLinkRepository;
  public readonly contact: ContactRepository;

  constructor(private readonly deps: { prisma: PrismaClientOrTransaction }) {
    const { prisma } = deps;
    this.auth = new PrismaAuthRepository(prisma);
    this.profile = new PrismaProfileRepository(prisma);
    this.workExperience = new PrismaWorkExperienceRepository(prisma);
    this.skill = new PrismaSkillRepository(prisma);
    this.education = new PrismaEducationRepository(prisma);
    this.certification = new PrismaCertificationRepository(prisma);
    this.projectExperience = new PrismaProjectExperienceRepository(prisma);
    this.projectLink = new PrismaProjectLinkRepository(prisma);
    this.contact = new PrismaContactRepository(prisma);
  }

  async runInTransaction<T>(handler: (uow: TransactionalUnitOfWork) => Promise<T>): Promise<T> {
    if (!("$transaction" in this.deps.prisma)) {
      return handler(this);
    }
    return this.deps.prisma.$transaction(async (transaction) => {
      const transactionalUow = new PrismaUnitOfWork({ prisma: transaction });
      return handler(transactionalUow);
    });
  }
}
