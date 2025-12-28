import { Auth as PrismaAuthModel, Prisma } from "../../../../../generated/prisma/client";
import { Auth, type AuthAttributes } from "../../../../core/entities/auth/auth.entity";
import { type AuthRepository } from "../../../../core/entities/auth/auth.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaAuthModel): Auth => new Auth(record);

  async create(attributes: Partial<AuthAttributes>): Promise<Auth> {
    const record = await this.prisma.auth.create({
      data: attributes as Prisma.AuthUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Auth | null> {
    const record = await this.prisma.auth.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<AuthAttributes>): Promise<Auth> {
    const record = await this.prisma.auth.update({
      where: { id },
      data: attributes as Prisma.AuthUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.auth.delete({ where: { id } });
  }

  async findAll(): Promise<Auth[]> {
    const records = await this.prisma.auth.findMany();
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<AuthAttributes>): Promise<Auth> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as AuthAttributes & { id: string };
    const record = await this.prisma.auth.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.AuthUncheckedCreateInput) },
      update: rest as Prisma.AuthUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
