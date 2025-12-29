import { Prisma, Skill as PrismaSkillModel } from "../../../../../generated/prisma/client";
import { Skill, type SkillAttributes } from "../../../../core/entities/skill/skill.entity";
import { type SkillRepository } from "../../../../core/entities/skill/skill.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaSkillRepository implements SkillRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaSkillModel): Skill => new Skill(record);

  async create(attributes: Partial<SkillAttributes>): Promise<Skill> {
    const record = await this.prisma.skill.create({
      data: attributes as Prisma.SkillUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Skill | null> {
    const record = await this.prisma.skill.findFirst({ where: { id, deletedAt: null } });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<SkillAttributes>): Promise<Skill> {
    const record = await this.prisma.skill.update({
      where: { id },
      data: attributes as Prisma.SkillUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.skill.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findByProfileId(profileId: string): Promise<Skill[]> {
    const records = await this.prisma.skill.findMany({
      where: { profileId, deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async findAll(): Promise<Skill[]> {
    const records = await this.prisma.skill.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<SkillAttributes>): Promise<Skill> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as SkillAttributes & { id: string };
    const record = await this.prisma.skill.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.SkillUncheckedCreateInput) },
      update: rest as Prisma.SkillUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
