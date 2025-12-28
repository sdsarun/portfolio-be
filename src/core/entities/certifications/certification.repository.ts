import { Certification, CertificationAttributes } from "./certifications.entity";

export type CertificationRepository = {
  create(attributes: Partial<CertificationAttributes>): Promise<Certification>;
  findById(id: string): Promise<Certification | null>;
  updateById(id: string, attributes: Partial<CertificationAttributes>): Promise<Certification>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<Certification[]>;
  upsert(attributes: Partial<CertificationAttributes>): Promise<Certification>;
};
