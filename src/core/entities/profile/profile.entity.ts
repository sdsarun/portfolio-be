import { Entity } from '../base/base.entity';

export type ProfileAttributes = {
  id: string | null;
  displayName: string | null;
  roleName: string | null;
  bioTitle: string | null;
  bioDescription: string | null;
  updatedAt: Date | null;
  resumeUrl: string | null;
  siteUrl: string | null;
};

export class Profile extends Entity<ProfileAttributes> {
  protected getDefaultAttributes(): ProfileAttributes {
    return {
      id: null,
      displayName: null,
      roleName: null,
      bioTitle: null,
      bioDescription: null,
      updatedAt: null,
      resumeUrl: null,
      siteUrl: null
    };
  }
}
