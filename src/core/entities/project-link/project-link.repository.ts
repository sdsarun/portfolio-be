import { ProjectLink, ProjectLinkAttributes } from "./project-link.entity";

export type ProjectLinkRepository = {
  create(attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink>;
  findById(id: string): Promise<ProjectLink | null>;
  updateById(id: string, attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<ProjectLink[]>;
  upsert(attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink>;
};
