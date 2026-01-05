import { type Attachment, type AttachmentAttributes } from "./attachment.entity";

export type AttachmentRepository = {
  create(attributes: Partial<AttachmentAttributes>): Promise<Attachment>;
  findById(id: string): Promise<Attachment | null>;
  findManyByIds(id: string[]): Promise<Attachment[]>;
  updateById(id: string, attributes: Partial<AttachmentAttributes>): Promise<Attachment>;
  deleteById(id: string): Promise<void>;
  softDeleteByIds(id: string[]): Promise<void>;
  upsert(attributes: Partial<AttachmentAttributes>): Promise<Attachment>;
};
