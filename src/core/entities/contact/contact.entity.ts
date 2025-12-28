import { Entity } from '../base/base.entity';

export type ContactAttributes = {
  id: string | null;
  type: string | null;
  value: string | null;
  displayOrder: number | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Contact extends Entity<ContactAttributes> {
  protected getDefaultAttributes(): ContactAttributes {
    return {
      id: null,
      type: null,
      value: null,
      displayOrder: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
