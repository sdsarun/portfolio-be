import { type Profile, type ProfileAttributes } from "./profile.entity";

export type ProfileRepository = {
  create(attributes: Partial<ProfileAttributes>): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findByAuthId(authId: string): Promise<Profile | null>;
  updateById(id: string, attributes: Partial<ProfileAttributes>): Promise<Profile>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<Profile[]>;
  upsert(attributes: Partial<ProfileAttributes>): Promise<Profile>;
};
