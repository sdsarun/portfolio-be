import { Entity } from "../base/base.entity";

export type AttachmentAttributes = {
  id: string | null;
  name: string | null;
  storageType: string | null;
  storageProvider: string | null;
  size: number | null;
  mime: string | null;
  sha: string | null;
  storedPath: string | null;
  streamUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class Attachment extends Entity<AttachmentAttributes> {
  protected getDefaultAttributes(): AttachmentAttributes {
    return {
      id: null,
      name: null,
      size: null,
      mime: null,
      sha: null,
      storedPath: null,
      storageProvider: null,
      storageType: null,
      streamUrl: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null
    };
  }
}
