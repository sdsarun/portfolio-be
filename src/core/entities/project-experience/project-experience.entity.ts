import { Entity } from '../base/base.entity';

export type ProjectExperienceAttributes = {
  id: string | null;
  title: string | null;
  isInProgress: boolean | null;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl: string | null;
  description: string | null;
  tags: string | null;
  displayOrder: number | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class ProjectExperience extends Entity<ProjectExperienceAttributes> {
  protected getDefaultAttributes(): ProjectExperienceAttributes {
    return {
      id: null,
      title: null,
      isInProgress: null,
      startDate: null,
      endDate: null,
      imageUrl: null,
      description: null,
      tags: null,
      displayOrder: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
