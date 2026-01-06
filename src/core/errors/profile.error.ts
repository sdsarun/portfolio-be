import { BaseError } from "./base.error";

export class ProfileError extends BaseError {
  constructor(options: { title: string; status: number; detail?: string; code: string }) {
    super({
      title: options.title,
      status: options.status,
      detail: options.detail,
      code: options.code
    });
  }
}

export class ProfileNotFoundError extends ProfileError {
  constructor(detail?: string) {
    super({
      title: "Profile not found",
      status: 404,
      detail: detail ?? "Profile data is not available.",
      code: "PROFILE_NOT_FOUND"
    });
  }
}

export class UpsertProfileWorkError extends ProfileError {
  constructor(detail?: string) {
    super({
      title: "Upsert profile work failed",
      status: 500,
      detail: detail ?? "An unexpected error occurred while updating profile work.",
      code: "UPSERT_PROFILE_WORK_FAILED"
    });
  }
}
