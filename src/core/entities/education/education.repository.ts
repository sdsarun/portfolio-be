import { Education, EducationAttributes } from "./education.entity";

export type EducationRepository = {
  create(attributes: Partial<EducationAttributes>): Promise<Education>;
  findById(id: string): Promise<Education | null>;
  updateById(id: string, attributes: Partial<EducationAttributes>): Promise<Education>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<Education[]>;
  upsert(attributes: Partial<EducationAttributes>): Promise<Education>;
};
