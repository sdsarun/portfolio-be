import { Entity } from "../base/base.entity";

export type ApiKeyAttributes = {
  id: string | null;
  name: string | null;
  hashedKey: string | null;
  scope: string | null;
  createdAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
};

export class ApiKey extends Entity<ApiKeyAttributes> {
  protected getDefaultAttributes(): ApiKeyAttributes {
    return {
      id: null,
      name: null,
      hashedKey: null,
      scope: null,
      createdAt: null,
      expiresAt: null,
      revokedAt: null
    };
  }
}
