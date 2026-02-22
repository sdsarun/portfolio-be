import { type AttachmentAttributes } from "../../entities/attachment/attachment.entity";
import { type ProjectExperienceAttributes } from "../../entities/project-experience/project-experience.entity";
import { type ProjectLinkAttributes } from "../../entities/project-link/project-link.entity";

type ProjectExperienceAggregate = ProjectExperienceAttributes & {
  links: ProjectLinkAttributes[];
  attachments: AttachmentAttributes[];
};

export type GetProfileWorkOutput = {
  projectExperiences: ProjectExperienceAggregate[];
};
