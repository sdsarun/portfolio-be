import { Entity } from "../base/base.entity";

export type SkillAttributes = {
  id: string | null;
  profileId: string | null;
  categoryName: string | null;
  skillNames: string | null;
  displayOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Skill extends Entity<SkillAttributes> {
  protected getDefaultAttributes(): SkillAttributes {
    return {
      id: null,
      profileId: null,
      categoryName: null,
      skillNames: null,
      displayOrder: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
