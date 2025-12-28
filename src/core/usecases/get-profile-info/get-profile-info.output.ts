import { type ProfileAttributes } from "../../entities/profile/profile.entity";

export type GetProfileInfoOutput = {
  profile: ProfileAttributes | null;
};
