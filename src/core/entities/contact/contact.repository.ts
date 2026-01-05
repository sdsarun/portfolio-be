import { type Contact, type ContactAttributes } from "./contact.entity";

export type ContactRepository = {
  create(attributes: Partial<ContactAttributes>): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  updateById(id: string, attributes: Partial<ContactAttributes>): Promise<Contact>;
  deleteById(id: string): Promise<void>;
  findByProfileId(profileId: string): Promise<Contact[]>;
  findAll(): Promise<Contact[]>;
  upsert(attributes: Partial<ContactAttributes>): Promise<Contact>;
};
