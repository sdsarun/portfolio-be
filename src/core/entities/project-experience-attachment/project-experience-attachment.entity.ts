import { Entity } from "../base/base.entity";

export type ProjectExperienceAttachmentAttributes = {
  id: string | null;
  projectId: string | null;
  attachmentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class ProjectExperienceAttachment extends Entity<ProjectExperienceAttachmentAttributes> {
  protected getDefaultAttributes(): ProjectExperienceAttachmentAttributes {
    return {
      id: null,
      projectId: null,
      attachmentId: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
