import { Entity } from '../base/base.entity';

export type AuthAttributes = {
  id: string | null;
  hashPassword: string | null;
  updatedAt: Date | null;
};

export class Auth extends Entity<AuthAttributes> {
  protected getDefaultAttributes(): AuthAttributes {
    return {
      id: null,
      hashPassword: null,
      updatedAt: null
    };
  }
}
