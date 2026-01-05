import { Entity } from "../base/base.entity";

export type ContactAttributes = {
  id: string | null;
  profileId: string | null;
  type: string | null;
  value: string | null;
  label: string | null;
  displayValue: string | null;
  displayOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Contact extends Entity<ContactAttributes> {
  protected getDefaultAttributes(): ContactAttributes {
    return {
      id: null,
      profileId: null,
      type: null,
      value: null,
      label: null,
      displayValue: null,
      displayOrder: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
