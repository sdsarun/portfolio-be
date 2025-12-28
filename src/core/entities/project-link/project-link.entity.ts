import { Entity } from '../base/base.entity';

export type ProjectLinkAttributes = {
  id: string | null;
  projectId: string | null;
  name: string | null;
  url: string | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class ProjectLink extends Entity<ProjectLinkAttributes> {
  protected getDefaultAttributes(): ProjectLinkAttributes {
    return {
      id: null,
      projectId: null,
      name: null,
      url: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
