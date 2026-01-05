import { Entity } from "../base/base.entity";

export type ProfileAttributes = {
  authId: string | null;
  id: string | null;
  displayName: string | null;
  roleName: string | null;
  bioTitle: string | null;
  bioDescription: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  resumeUrl: string | null;
  siteUrl: string | null;
};

export class Profile extends Entity<ProfileAttributes> {
  protected getDefaultAttributes(): ProfileAttributes {
    return {
      authId: null,
      id: null,
      displayName: null,
      roleName: null,
      bioTitle: null,
      bioDescription: null,
      createdAt: null,
      updatedAt: null,
      resumeUrl: null,
      siteUrl: null
    };
  }
}
