import { BaseError } from "./base.error";

export class AttachmentUploadError extends BaseError {
  constructor(fileName: string, detail?: string) {
    super({
      title: "Attachment upload failed",
      status: 500,
      detail: detail ?? `Failed to upload attachment: ${fileName}`,
      code: "ATTACHMENT_UPLOAD_FAILED"
    });
  }
}

export class AttachmentDeleteError extends BaseError {
  constructor(fileName: string, detail?: string) {
    super({
      title: "Attachment delete failed",
      status: 500,
      detail: detail ?? `Failed to delete attachment: ${fileName}`,
      code: "ATTACHMENT_DELETE_FAILED"
    });
  }
}
