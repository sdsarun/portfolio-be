import { Prisma, Education as PrismaEducationModel } from "../../../../../generated/prisma/client";
import {
  Education,
  type EducationAttributes
} from "../../../../core/entities/education/education.entity";
import { type EducationRepository } from "../../../../core/entities/education/education.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaEducationRepository implements EducationRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaEducationModel): Education => new Education(record);

  async create(attributes: Partial<EducationAttributes>): Promise<Education> {
    const record = await this.prisma.education.create({
      data: attributes as Prisma.EducationUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Education | null> {
    const record = await this.prisma.education.findFirst({ where: { id, deletedAt: null } });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<EducationAttributes>): Promise<Education> {
    const record = await this.prisma.education.update({
      where: { id },
      data: attributes as Prisma.EducationUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.education.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findByProfileId(profileId: string): Promise<Education[]> {
    const records = await this.prisma.education.findMany({
      where: { profileId, deletedAt: null },
      orderBy: [{ updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async findAll(): Promise<Education[]> {
    const records = await this.prisma.education.findMany({
      where: { deletedAt: null },
      orderBy: [{ updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<EducationAttributes>): Promise<Education> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as EducationAttributes & { id: string };
    const record = await this.prisma.education.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.EducationUncheckedCreateInput) },
      update: rest as Prisma.EducationUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
