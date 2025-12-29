import {
  Prisma,
  Certification as PrismaCertificationModel
} from "../../../../../generated/prisma/client";
import {
  Certification,
  type CertificationAttributes
} from "../../../../core/entities/certifications/certifications.entity";
import { type CertificationRepository } from "../../../../core/entities/certifications/certification.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaCertificationRepository implements CertificationRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaCertificationModel): Certification =>
    new Certification(record);

  async create(attributes: Partial<CertificationAttributes>): Promise<Certification> {
    const record = await this.prisma.certification.create({
      data: attributes as Prisma.CertificationUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Certification | null> {
    const record = await this.prisma.certification.findFirst({
      where: { id, deletedAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<CertificationAttributes>): Promise<Certification> {
    const record = await this.prisma.certification.update({
      where: { id },
      data: attributes as Prisma.CertificationUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.certification.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async findByProfileId(profileId: string): Promise<Certification[]> {
    const records = await this.prisma.certification.findMany({
      where: { profileId, deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async findAll(): Promise<Certification[]> {
    const records = await this.prisma.certification.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<CertificationAttributes>): Promise<Certification> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as CertificationAttributes & { id: string };
    const record = await this.prisma.certification.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.CertificationUncheckedCreateInput) },
      update: rest as Prisma.CertificationUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
