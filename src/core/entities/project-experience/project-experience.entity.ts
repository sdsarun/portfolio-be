import { Entity } from "../base/base.entity";
import { ProjectLink } from "../project-link/project-link.entity";

export type ProjectExperienceAttributes = {
  id: string | null;
  profileId: string | null;
  title: string | null;
  isInProgress: boolean | null;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl: string | null;
  description: string | null;
  tags: string | null;
  displayOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  projectLinks: ProjectLink[] | null;
};

export class ProjectExperience extends Entity<ProjectExperienceAttributes> {
  constructor(attributes?: Partial<ProjectExperienceAttributes>) {
    super({
      ...attributes,
      projectLinks: attributes?.projectLinks
        ? attributes.projectLinks.map((link) =>
            link instanceof ProjectLink ? link : new ProjectLink(link)
          )
        : null
    });
  }

  protected getDefaultAttributes(): ProjectExperienceAttributes {
    return {
      id: null,
      profileId: null,
      title: null,
      isInProgress: null,
      startDate: null,
      endDate: null,
      imageUrl: null,
      description: null,
      tags: null,
      displayOrder: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      projectLinks: null
    };
  }
}
