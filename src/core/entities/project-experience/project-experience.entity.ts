import { Entity } from "../base/base.entity";

export type ProjectExperienceAttributes = {
  id: string | null;
  profileId: string | null;
  title: string | null;
  isInProgress: boolean | null;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  tags: string | null;
  displayOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class ProjectExperience extends Entity<ProjectExperienceAttributes> {
  protected getDefaultAttributes(): ProjectExperienceAttributes {
    return {
      id: null,
      profileId: null,
      title: null,
      isInProgress: null,
      startDate: null,
      endDate: null,
      description: null,
      tags: null,
      displayOrder: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
