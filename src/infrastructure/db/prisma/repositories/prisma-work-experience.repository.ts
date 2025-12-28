import {
  Prisma,
  WorkExperience as PrismaWorkExperienceModel
} from "../../../../../generated/prisma/client";
import {
  WorkExperience,
  type WorkExperienceAttributes
} from "../../../../core/entities/work-experience/work-experience.entity";
import { type WorkExperienceRepository } from "../../../../core/entities/work-experience/work-experience.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaWorkExperienceRepository implements WorkExperienceRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaWorkExperienceModel): WorkExperience =>
    new WorkExperience(record);

  async create(attributes: Partial<WorkExperienceAttributes>): Promise<WorkExperience> {
    const record = await this.prisma.workExperience.create({
      data: attributes as Prisma.WorkExperienceUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<WorkExperience | null> {
    const record = await this.prisma.workExperience.findFirst({
      where: { id, deletedAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<WorkExperienceAttributes>): Promise<WorkExperience> {
    const record = await this.prisma.workExperience.update({
      where: { id },
      data: attributes as Prisma.WorkExperienceUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.workExperience.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async findAll(): Promise<WorkExperience[]> {
    const records = await this.prisma.workExperience.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<WorkExperienceAttributes>): Promise<WorkExperience> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as WorkExperienceAttributes & { id: string };
    const record = await this.prisma.workExperience.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.WorkExperienceUncheckedCreateInput) },
      update: rest as Prisma.WorkExperienceUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
