import { Skill, SkillAttributes } from "./skill.entity";

export type SkillRepository = {
  create(attributes: Partial<SkillAttributes>): Promise<Skill>;
  findById(id: string): Promise<Skill | null>;
  updateById(id: string, attributes: Partial<SkillAttributes>): Promise<Skill>;
  deleteById(id: string): Promise<void>;
  findByProfileId(profileId: string): Promise<Skill[]>;
  findAll(): Promise<Skill[]>;
  upsert(attributes: Partial<SkillAttributes>): Promise<Skill>;
};
