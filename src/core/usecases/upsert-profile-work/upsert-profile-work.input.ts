import { type AttachmentAttributes } from "../../entities/attachment/attachment.entity";
import { type ProjectExperienceAttributes } from "../../entities/project-experience/project-experience.entity";
import { type ProjectLinkAttributes } from "../../entities/project-link/project-link.entity";

type UpdateAttachmentInput = Partial<
  Omit<AttachmentAttributes, "createdAt" | "updatedAt" | "deletedAt">
> & {
  content?: string | null;
};

type UpdateProjectExperienceInput = Partial<
  Omit<
    ProjectExperienceAttributes,
    "profileId" | "updatedAt" | "deletedAt" | "projectLinks" | "imageUrl"
  > & {
    attachments?: UpdateAttachmentInput[] | null;
  }
>;

type UpdateProjectLinkInput = Partial<
  Omit<ProjectLinkAttributes, "createdAt" | "updatedAt" | "deletedAt" | "projectId">
>;

export type UpsertProfileWorkInput = {
  projectExperiences: (UpdateProjectExperienceInput & {
    links?: UpdateProjectLinkInput[] | null;
  })[];
};
