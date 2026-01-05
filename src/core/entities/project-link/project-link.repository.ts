import { type ProjectLink, type ProjectLinkAttributes } from "./project-link.entity";

export type ProjectLinkRepository = {
  create(attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink>;
  findById(id: string): Promise<ProjectLink | null>;
  findManyByProjectIds(id: string[]): Promise<ProjectLink[]>;
  updateById(id: string, attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink>;
  deleteById(id: string): Promise<void>;
  deleteByProjectId(id: string): Promise<void>;
  softDeleteByIds(id: string[]): Promise<void>;
  softDeleteByProjectIds(id: string[]): Promise<void>;
  upsert(attributes: Partial<ProjectLinkAttributes>): Promise<ProjectLink>;
};
