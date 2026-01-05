import { Entity } from "../base/base.entity";

export type EducationAttributes = {
  id: string | null;
  profileId: string | null;
  major: string | null;
  institution: string | null;
  startDate: Date | null;
  endDate: Date | null;
  displayOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Education extends Entity<EducationAttributes> {
  protected getDefaultAttributes(): EducationAttributes {
    return {
      id: null,
      profileId: null,
      major: null,
      institution: null,
      startDate: null,
      endDate: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      displayOrder: null
    };
  }
}
