import { type ApiKey, type ApiKeyAttributes } from "./api-key.entity";

export type ApiKeyRepository = {
  create(attributes: Partial<ApiKeyAttributes>): Promise<ApiKey>;
  createMany(attributes: Partial<ApiKeyAttributes>[]): Promise<ApiKey[]>;
  findByHashedKey(hashedKey: string): Promise<ApiKey | null>;
  revokedByIds(id: string[]): Promise<void>;
};
