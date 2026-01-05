import { type Auth, type AuthAttributes } from "./auth.entity";

export type AuthRepository = {
  create(attributes: Partial<AuthAttributes>): Promise<Auth>;
  findById(id: string): Promise<Auth | null>;
  updateById(id: string, attributes: Partial<AuthAttributes>): Promise<Auth>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<Auth[]>;
  upsert(attributes: Partial<AuthAttributes>): Promise<Auth>;
};
