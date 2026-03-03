import { type GetApiKeysInput } from "../../usecases/get-api-keys/get-api-keys.input";

const PREFIX = "api-key";

export const ApiKeyCacheKeys = {
  allPattern: `${PREFIX}:*`,
  findValidByHashedKey: (hashed: string) => `${PREFIX}:${hashed}`,
  getApiKeys: (input: GetApiKeysInput) => `${PREFIX}:${input.offset}:${input.limit}`
} as const;
