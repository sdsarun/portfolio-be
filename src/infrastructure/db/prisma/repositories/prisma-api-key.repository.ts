import { type ApiKeyAttributes, ApiKey } from "../../../../core/entities/api-key/api-key.entity";
import {
  type FindPaginatedOutput,
  type FindPaginatedParams,
  type ApiKeyRepository
} from "../../../../core/entities/api-key/api-key.repository";
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

  async findPaginated(params: FindPaginatedParams): Promise<FindPaginatedOutput> {
    const { offset, limit } = params;

    const where: Prisma.ApiKeyWhereInput = {
      deletedAt: null
    };

    const orderBy: Prisma.ApiKeyOrderByWithRelationInput | Prisma.ApiKeyOrderByWithRelationInput[] = [
      { createdAt: "asc" }
    ];

    const [records, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy
      }),
      this.prisma.apiKey.count({ where })
    ]);

    return {
      data: records.map(this.toEntity),
      meta: {
        total,
        limit,
        offset
      }
    };
  }

  async findById(id: string): Promise<ApiKey | null> {
    const record = await this.prisma.apiKey.findUnique({
      where: { id, deletedAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async findByHashedKey(hashedKey: string): Promise<ApiKey | null> {
    const record = await this.prisma.apiKey.findUnique({
      where: { hashedKey, deletedAt: null }
    });
    return record ? this.toEntity(record) : null;
  }

  async findValidByHashedKey(hashedKey: string): Promise<ApiKey | null> {
    const record = await this.prisma.apiKey.findFirst({
      where: {
        hashedKey,
        deletedAt: null,
        revokedAt: null
      }
    });
    return record ? this.toEntity(record) : null;
  }

  async revokeByIds(id: string[]): Promise<void> {
    await this.prisma.apiKey.updateMany({
      data: { revokedAt: new Date() },
      where: { id: { in: id } }
    });
  }

  async softDeleteById(id: string): Promise<void> {
    await this.prisma.apiKey.update({
      data: { deletedAt: new Date() },
      where: { id }
    });
  }
}
