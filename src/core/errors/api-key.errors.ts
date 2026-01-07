import { BaseError, type BaseErrorOptions } from "./base.error";

export class ApiKeyError extends BaseError {
  constructor(options: BaseErrorOptions) {
    super(options);
  }
}

export class ApiKeyCreateFailedError extends ApiKeyError {
  constructor() {
    super({
      title: "API key creation failed",
      status: 500,
      detail: "The API key could not be created due to an internal error.",
      code: "API_KEY_CREATE_FAILED"
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
