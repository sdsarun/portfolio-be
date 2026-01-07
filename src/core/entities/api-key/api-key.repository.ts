import { type ApiKey, type ApiKeyAttributes } from "./api-key.entity";

export type ApiKeyRepository = {
  findByHashedKey(hashedKey: string): Promise<ApiKey | null>;
  create(attributes: Partial<ApiKeyAttributes>): Promise<ApiKey>;
  createMany(attributes: Partial<ApiKeyAttributes>[]): Promise<ApiKey[]>;
  revokeByIds(id: string[]): Promise<void>;
};
