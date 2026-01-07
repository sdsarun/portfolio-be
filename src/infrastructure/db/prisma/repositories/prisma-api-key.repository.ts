import { type ApiKeyAttributes, ApiKey } from "../../../../core/entities/api-key/api-key.entity";
import { type ApiKeyRepository } from "../../../../core/entities/api-key/api-key.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";
import { type ApiKey as PrismaApiKeyModel, type Prisma } from "../../../../../generated/prisma/client";

export class PrismaApiKeyRepository implements ApiKeyRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaApiKeyModel): ApiKey => new ApiKey(record);

  async create(attributes: Partial<ApiKeyAttributes>): Promise<ApiKey> {
    const record = await this.prisma.apiKey.create({
      data: attributes as Prisma.ApiKeyUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async createMany(attributes: Partial<ApiKeyAttributes>[]): Promise<ApiKey[]> {
    const records = await this.prisma.apiKey.createManyAndReturn({
      data: attributes as Prisma.ApiKeyUncheckedCreateInput[]
    });
    return records.map(this.toEntity);
  }

  async findByHashedKey(hashedKey: string): Promise<ApiKey | null> {
    const record = await this.prisma.apiKey.findUnique({
      where: { hashedKey, revokedAt: null, expiresAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async revokeByIds(id: string[]): Promise<void> {
    await this.prisma.apiKey.updateMany({
      data: { revokedAt: new Date() },
      where: { id: { in: id } }
    });
  }
}
