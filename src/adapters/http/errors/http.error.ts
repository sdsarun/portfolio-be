import { BaseError } from "../../../core/errors/base.error";

export class InternalServerError extends BaseError {
  constructor(detail: string = "Something went wrong") {
    super({
      title: "Internal server error",
      status: 500,
      detail,
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}
