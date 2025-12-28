import { Entity } from '../base/base.entity';

export type SkillAttributes = {
  id: string | null;
  categoryName: string | null;
  skillNames: string | null;
  displayOrder: number | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Skill extends Entity<SkillAttributes> {
  protected getDefaultAttributes(): SkillAttributes {
    return {
      id: null,
      categoryName: null,
      skillNames: null,
      displayOrder: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
