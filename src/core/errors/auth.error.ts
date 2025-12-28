import { BaseError } from "./base.error";

export class AuthError extends BaseError {
  constructor(options: { title: string; status: number; detail?: string; code: string }) {
    super({
      title: options.title,
      status: options.status,
      detail: options.detail,
      code: options.code
    });
  }
}

export class MissingAuthDataError extends AuthError {
  constructor() {
    super({
      title: "Authentication data missing",
      status: 400,
      detail: "Authentication data is not configured.",
      code: "AUTH_MISSING_DATA"
    });
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super({
      title: "Invalid credentials",
      status: 401,
      detail: "The supplied credentials are invalid.",
      code: "AUTH_INVALID_CREDENTIALS"
    });
  }
}

export class UnauthorizedError extends AuthError {
  constructor(detail?: string) {
    super({
      title: "Unauthorized",
      status: 401,
      detail: detail ?? "Access is unauthorized.",
      code: "AUTH_UNAUTHORIZED"
    });
  }
}

export class PasswordConfirmMismatchError extends AuthError {
  constructor() {
    super({
      title: "Password confirmation mismatch",
      status: 400,
      detail: "New password and confirmation do not match.",
      code: "AUTH_PASSWORD_CONFIRM_MISMATCH"
    });
  }
}

export class PasswordUnchangedError extends AuthError {
  constructor() {
    super({
      title: "Password unchanged",
      status: 400,
      detail: "New password must be different from old password.",
      code: "AUTH_PASSWORD_UNCHANGED"
    });
  }
}

export class InvalidOldPasswordError extends AuthError {
  constructor() {
    super({
      title: "Invalid old password",
      status: 400,
      detail: "Old password is incorrect.",
      code: "AUTH_INVALID_OLD_PASSWORD"
    });
  }
}
