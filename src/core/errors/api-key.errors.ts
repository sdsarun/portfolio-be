import { BaseError, type BaseErrorOptions } from "./base.error";

export class ApiKeyError extends BaseError {
  constructor(options: BaseErrorOptions) {
    super(options);
  }
}

export class ApiKeyNotFoundError extends ApiKeyError {
  constructor() {
    super({
      title: "API key not found",
      status: 404,
      detail: "The provided API key does not exist or has been deleted.",
      code: "API_KEY_NOT_FOUND"
    });
  }
}

export class ApiKeyCreateFailedError extends ApiKeyError {
  constructor(detail?: string) {
    super({
      title: "API key creation failed",
      status: 500,
      detail: detail ?? "The API key could not be created due to an internal error.",
      code: "API_KEY_CREATE_FAILED"
    });
  }
}

export class ApiKeyDeleteFailedError extends ApiKeyError {
  constructor(detail?: string) {
    super({
      title: "API key deletion failed",
      status: 500,
      detail: detail ?? "The API key could not be deleted due to an internal error.",
      code: "API_KEY_DELETE_FAILED"
    });
  }
}

export class ApiKeyInvalidError extends ApiKeyError {
  constructor() {
    super({
      title: "Invalid API key",
      status: 401,
      detail: "The provided API key is invalid or unauthorized.",
      code: "API_KEY_INVALID"
    });
  }
}

export class ApiKeyRevokeFailedError extends ApiKeyError {
  constructor(detail?: string) {
    super({
      title: "API key revoke failed",
      status: 500,
      detail: detail ?? "The API key could not be revoked due to an internal server error.",
      code: "API_KEY_REVOKE_FAILED"
    });
  }
}
