import { Entity } from '../base/base.entity';

export type CertificationAttributes = {
  id: string | null;
  name: string | null;
  issuer: string | null;
  completeDate: Date | null;
  displayOrder: number | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Certification extends Entity<CertificationAttributes> {
  protected getDefaultAttributes(): CertificationAttributes {
    return {
      id: null,
      name: null,
      issuer: null,
      completeDate: null,
      displayOrder: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
