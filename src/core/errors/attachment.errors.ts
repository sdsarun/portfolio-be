import { BaseError, type BaseErrorOptions } from "./base.error";

export class AttachmentError extends BaseError {
  constructor(options: BaseErrorOptions) {
    super(options);
  }
}

export class AttachmentUploadError extends AttachmentError {
  constructor(fileName: string, detail?: string) {
    super({
      title: "Attachment upload failed",
      status: 500,
      detail: detail ?? `Failed to upload attachment: ${fileName}`,
      code: "ATTACHMENT_UPLOAD_FAILED"
    });
  }
}

export class AttachmentDeleteError extends AttachmentError {
  constructor(fileName: string, detail?: string) {
    super({
      title: "Attachment delete failed",
      status: 500,
      detail: detail ?? `Failed to delete attachment: ${fileName}`,
      code: "ATTACHMENT_DELETE_FAILED"
    });
  }
}
