import { Prisma, Contact as PrismaContactModel } from "../../../../../generated/prisma/client";
import { Contact, type ContactAttributes } from "../../../../core/entities/contact/contact.entity";
import { type ContactRepository } from "../../../../core/entities/contact/contact.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaContactRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaContactModel): Contact => new Contact(record);

  async create(attributes: Partial<ContactAttributes>): Promise<Contact> {
    const record = await this.prisma.contact.create({
      data: attributes as Prisma.ContactUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Contact | null> {
    const record = await this.prisma.contact.findFirst({ where: { id, deletedAt: null } });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<ContactAttributes>): Promise<Contact> {
    const record = await this.prisma.contact.update({
      where: { id },
      data: attributes as Prisma.ContactUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findByProfileId(profileId: string): Promise<Contact[]> {
    const records = await this.prisma.contact.findMany({
      where: { profileId, deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async findAll(): Promise<Contact[]> {
    const records = await this.prisma.contact.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<ContactAttributes>): Promise<Contact> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as ContactAttributes & { id: string };
    const record = await this.prisma.contact.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.ContactUncheckedCreateInput) },
      update: rest as Prisma.ContactUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
