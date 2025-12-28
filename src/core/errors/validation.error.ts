import { BaseError, type ProblemDetail } from "./base.error";

export type ValidationIssue = {
  path: (string | number | symbol)[];
  message: string;
  code?: string;
};

export class ValidationError extends BaseError {
  public readonly issues?: ValidationIssue[];

  constructor(options?: { detail?: string; issues?: ValidationIssue[] }) {
    super({
      title: "Validation error",
      status: 400,
      detail: options?.detail ?? "Request validation failed.",
      code: "VALIDATION_ERROR"
    });
    this.issues = options?.issues;
  }

  override toProblemDetail(): ProblemDetail & { issues?: ValidationIssue[] } {
    const problemDetail = super.toProblemDetail() as ProblemDetail & {
      issues?: ValidationIssue[];
    };
    if (this.issues?.length) {
      problemDetail.issues = this.issues;
    }
    return problemDetail;
  }
}
