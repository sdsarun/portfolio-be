import {
  type ProjectExperienceAttachmentAttributes,
  type ProjectExperienceAttachment
} from "./project-experience-attachment.entity";

export type ProjectExperienceAttachmentRepository = {
  create(
    attributes: Partial<ProjectExperienceAttachmentAttributes>
  ): Promise<ProjectExperienceAttachment>;
  findById(id: string): Promise<ProjectExperienceAttachment | null>;
  findManyByProjectIds(id: string[]): Promise<ProjectExperienceAttachment[]>;
  updateById(
    id: string,
    attributes: Partial<ProjectExperienceAttachmentAttributes>
  ): Promise<ProjectExperienceAttachment>;
  deleteById(id: string): Promise<void>;
  softDeleteByIds(id: string[]): Promise<void>;
  softDeleteByAttachmentIds(id: string[]): Promise<void>;
  upsert(
    attributes: Partial<ProjectExperienceAttachmentAttributes>
  ): Promise<ProjectExperienceAttachment>;
};
