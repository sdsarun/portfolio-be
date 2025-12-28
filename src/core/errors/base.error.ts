export type ProblemDetail = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
};

export type BaseErrorOptions = Partial<ProblemDetail>;

export class BaseError extends Error {
  public readonly type: string;
  public readonly title: string;
  public readonly status: number;
  public readonly detail?: string;
  public readonly instance?: string;
  public readonly code?: string;
  public readonly rawError?: unknown;

  constructor(options?: BaseErrorOptions) {
    super(options?.detail ?? options?.title ?? "Unexpected error");
    this.name = new.target.name;
    this.type = options?.type ?? "about:blank";
    this.title = options?.title ?? "Unexpected error";
    this.status = options?.status ?? 500;
    this.detail = options?.detail;
    this.instance = options?.instance;
    this.code = options?.code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }

  toProblemDetail(): ProblemDetail {
    const problem: ProblemDetail = {
      type: this.type,
      title: this.title,
      status: this.status
    };

    if (this.detail) {
      problem.detail = this.detail;
    }

    if (this.instance) {
      problem.instance = this.instance;
    }

    if (this.code) {
      problem.code = this.code;
    }

    return problem;
  }
}
