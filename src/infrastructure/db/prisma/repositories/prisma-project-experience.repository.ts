import {
  Prisma,
  ProjectExperience as PrismaProjectExperienceModel
} from "../../../../../generated/prisma/client";
import {
  ProjectExperience,
  type ProjectExperienceAttributes
} from "../../../../core/entities/project-experience/project-experience.entity";
import { type ProjectExperienceRepository } from "../../../../core/entities/project-experience/project-experience.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaProjectExperienceRepository implements ProjectExperienceRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaProjectExperienceModel): ProjectExperience =>
    new ProjectExperience(record);

  async create(attributes: Partial<ProjectExperienceAttributes>): Promise<ProjectExperience> {
    const record = await this.prisma.projectExperience.create({
      data: attributes as Prisma.ProjectExperienceUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<ProjectExperience | null> {
    const record = await this.prisma.projectExperience.findFirst({
      where: { id, deletedAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async updateById(
    id: string,
    attributes: Partial<ProjectExperienceAttributes>
  ): Promise<ProjectExperience> {
    const record = await this.prisma.projectExperience.update({
      where: { id },
      data: attributes as Prisma.ProjectExperienceUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.projectExperience.delete({ where: { id } });
  }

  async softDeleteByIds(id: string[]): Promise<void> {
    await this.prisma.projectExperience.updateMany({
      data: { deletedAt: new Date() },
      where: { id: { in: id } }
    });
  }

  async findByProfileId(profileId: string): Promise<ProjectExperience[]> {
    const records = await this.prisma.projectExperience.findMany({
      where: { profileId, deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<ProjectExperienceAttributes>): Promise<ProjectExperience> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as ProjectExperienceAttributes & { id: string };
    const record = await this.prisma.projectExperience.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.ProjectExperienceUncheckedCreateInput) },
      update: rest as Prisma.ProjectExperienceUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
