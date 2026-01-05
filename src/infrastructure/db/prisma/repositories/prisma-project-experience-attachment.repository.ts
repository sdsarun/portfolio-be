import { type ProjectExperienceAttachmentRepository } from "../../../../core/entities/project-experience-attachment/project-experience-attachment.repository";
import {
  type ProjectExperienceAttachment as PrismaProjectExperienceAttachmentModel,
  type Prisma
} from "../../../../../generated/prisma/client";
import { type PrismaClientOrTransaction } from "../prisma-database-session";
import {
  ProjectExperienceAttachment,
  ProjectExperienceAttachmentAttributes
} from "../../../../core/entities/project-experience-attachment/project-experience-attachment.entity";

export class PrismaProjectExperienceAttachmentRepository implements ProjectExperienceAttachmentRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (
    record: PrismaProjectExperienceAttachmentModel
  ): ProjectExperienceAttachment => new ProjectExperienceAttachment(record);

  async create(
    attributes: Partial<ProjectExperienceAttachmentAttributes>
  ): Promise<ProjectExperienceAttachment> {
    const record = await this.prisma.projectExperienceAttachment.create({
      data: attributes as Prisma.ProjectExperienceAttachmentUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<ProjectExperienceAttachment | null> {
    const record = await this.prisma.projectExperienceAttachment.findUnique({
      where: { id, deletedAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async findManyByProjectIds(id: string[]): Promise<ProjectExperienceAttachment[]> {
    const records = await this.prisma.projectExperienceAttachment.findMany({
      where: { projectId: { in: id }, deletedAt: null }
    });
    return records.map(this.toEntity);
  }

  async updateById(
    id: string,
    attributes: Partial<ProjectExperienceAttachmentAttributes>
  ): Promise<ProjectExperienceAttachment> {
    const record = await this.prisma.projectExperienceAttachment.update({
      where: { id },
      data: attributes as Prisma.AuthUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.projectExperienceAttachment.delete({ where: { id } });
  }

  async softDeleteByIds(id: string[]): Promise<void> {
    await this.prisma.projectExperienceAttachment.updateMany({
      where: { id: { in: id } },
      data: { deletedAt: new Date() }
    });
  }

  async softDeleteByAttachmentIds(id: string[]): Promise<void> {
    await this.prisma.projectExperienceAttachment.updateMany({
      where: { attachmentId: { in: id } },
      data: { deletedAt: new Date() }
    });
  }

  async upsert(
    attributes: Partial<ProjectExperienceAttachmentAttributes>
  ): Promise<ProjectExperienceAttachment> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as ProjectExperienceAttachmentAttributes & { id: string };
    const record = await this.prisma.projectExperienceAttachment.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.ProjectExperienceAttachmentUncheckedCreateInput) },
      update: rest as Prisma.AuthUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
