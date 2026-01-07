import { type PaginationMeta } from "../../shared/types/pagination.types";
import { type ApiKey, type ApiKeyAttributes } from "./api-key.entity";

export type FindPaginatedParams = {
  offset: number;
  limit: number;
};

export type FindPaginatedOutput = {
  data: ApiKey[];
  meta: PaginationMeta;
};

export type ApiKeyRepository = {
  findPaginated(params: FindPaginatedParams): Promise<FindPaginatedOutput>;
  findByHashedKey(hashedKey: string): Promise<ApiKey | null>;
  create(attributes: Partial<ApiKeyAttributes>): Promise<ApiKey>;
  createMany(attributes: Partial<ApiKeyAttributes>[]): Promise<ApiKey[]>;
  revokeByIds(id: string[]): Promise<void>;
};
