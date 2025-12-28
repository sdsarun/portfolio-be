import { Entity } from '../base/base.entity';

export type EducationAttributes = {
  id: string | null;
  major: string | null;
  institution: string | null;
  startDate: Date | null;
  endDate: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Education extends Entity<EducationAttributes> {
  protected getDefaultAttributes(): EducationAttributes {
    return {
      id: null,
      major: null,
      institution: null,
      startDate: null,
      endDate: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
