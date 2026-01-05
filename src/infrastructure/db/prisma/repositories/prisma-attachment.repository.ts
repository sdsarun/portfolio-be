import { type AttachmentRepository } from "../../../../core/entities/attachment/attachment.repository";
import {
  type Attachment as PrismaAttachmentModel,
  type Prisma
} from "../../../../../generated/prisma/client";
import {
  Attachment,
  type AttachmentAttributes
} from "../../../../core/entities/attachment/attachment.entity";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaAttachmentModel): Attachment => new Attachment(record);

  async create(attributes: Partial<AttachmentAttributes>): Promise<Attachment> {
    const record = await this.prisma.attachment.create({
      data: attributes as Prisma.AttachmentUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Attachment | null> {
    const record = await this.prisma.attachment.findUnique({ where: { id, deletedAt: null } });
    return record ? this.toEntity(record) : null;
  }

  async findManyByIds(id: string[]): Promise<Attachment[]> {
    const records = await this.prisma.attachment.findMany({
      where: { id: { in: id }, deletedAt: null }
    });
    return records.map(this.toEntity);
  }

  async updateById(id: string, attributes: Partial<AttachmentAttributes>): Promise<Attachment> {
    const record = await this.prisma.attachment.update({
      where: { id },
      data: attributes as Prisma.AuthUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.attachment.delete({ where: { id } });
  }

  async softDeleteByIds(id: string[]): Promise<void> {
    await this.prisma.attachment.updateMany({
      data: { deletedAt: new Date() },
      where: { id: { in: id } }
    });
  }

  async upsert(attributes: Partial<AttachmentAttributes>): Promise<Attachment> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as AttachmentAttributes & { id: string };
    const record = await this.prisma.attachment.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.AuthUncheckedCreateInput) },
      update: rest as Prisma.AuthUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
