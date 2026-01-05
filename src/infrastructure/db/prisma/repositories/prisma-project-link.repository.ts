import { Prisma, ProjectLink as PrismaProjectLinkModel } from "../../../../../generated/prisma/client";
import {
  ProjectLink,
  type ProjectLinkAttributes
} from "../../../../core/entities/project-link/project-link.entity";
import { type ProjectLinkRepository } from "../../../../core/entities/project-link/project-link.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaProjectLinkRepository implements ProjectLinkRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaProjectLinkModel): ProjectLink => new ProjectLink(record);

  async create(attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink> {
    const record = await this.prisma.projectLink.create({
      data: attributes as Prisma.ProjectLinkUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<ProjectLink | null> {
    const record = await this.prisma.projectLink.findFirst({ where: { id, deletedAt: null } });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink> {
    const record = await this.prisma.projectLink.update({
      where: { id },
      data: attributes as Prisma.ProjectLinkUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.projectLink.delete({ where: { id } });
  }

  async deleteByProjectId(id: string): Promise<void> {
    await this.prisma.projectLink.deleteMany({
      where: { projectId: id }
    });
  }

  async softDeleteByIds(id: string[]): Promise<void> {
    await this.prisma.projectExperienceAttachment.updateMany({
      data: { deletedAt: new Date() },
      where: { id: { in: id } }
    });
  }

  async softDeleteByProjectIds(id: string[]): Promise<void> {
    await this.prisma.projectExperienceAttachment.updateMany({
      data: { deletedAt: new Date() },
      where: { projectId: { in: id } }
    });
  }

  async findManyByProjectIds(id: string[]): Promise<ProjectLink[]> {
    const records = await this.prisma.projectLink.findMany({
      where: {
        projectId: {
          in: id
        },
        deletedAt: null
      }
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as ProjectLinkAttributes & { id: string };
    const record = await this.prisma.projectLink.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.ProjectLinkUncheckedCreateInput) },
      update: rest as Prisma.ProjectLinkUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
