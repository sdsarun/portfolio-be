import { Entity } from '../base/base.entity';

export type WorkExperienceAttributes = {
  id: string | null;
  jobTitle: string | null;
  companyName: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isCurrent: boolean | null;
  description: string | null;
  displayOrder: number | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class WorkExperience extends Entity<WorkExperienceAttributes> {
  protected getDefaultAttributes(): WorkExperienceAttributes {
    return {
      id: null,
      jobTitle: null,
      companyName: null,
      startDate: null,
      endDate: null,
      isCurrent: null,
      description: null,
      displayOrder: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
