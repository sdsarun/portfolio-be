import { BaseError, ProblemDetail } from "../../core/errors/base.error";
import { InternalServerError } from "./errors/http.error";

export type HttpRequestInput = {
  body?: any;
  query?: any;
  params?: any;
  headers?: any;
  cookies?: any;
};

export type HttpRequest<T extends HttpRequestInput = HttpRequestInput> = {
  body?: T["body"];
  query?: T["query"];
  params?: T["params"];
  headers?: T["headers"];
  cookies?: T["cookies"];
  requestMeta: {
    path: string;
    ip: string;
  };
};

export type HttpResponse =
  | { success: true; statusCode: number; data: any }
  | { success: false; statusCode: number; error: any };

export type HttpContext<T extends HttpRequestInput = HttpRequestInput, S = Record<string, any>> = {
  request: HttpRequest<T>;
  state: S;
};

export type HttpMiddleware<T extends HttpRequestInput = HttpRequestInput> = {
  handle(ctx: HttpContext<T>): Promise<void> | void;
};

export type HttpHandler<T extends HttpRequestInput = HttpRequestInput> = {
  handle(ctx: HttpContext<T>): Promise<HttpResponse>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type HttpRoute = {
  method: HttpMethod;
  path: string;
  version?: number;
  handler: HttpHandler;
  middlewares?: HttpMiddleware[];
  // TODO: implemented cache route
  // cache?: {
  //   ttl?: number;
  //   key?: string | ((ctx: HttpContext) => string);
  // };
};

export type HttpRouteDefinition = {
  routes(): HttpRoute[];
};

export type HttpReply = {
  success(response: { statusCode: number; data?: any }): Promise<void> | void;
  error(response: { statusCode: number; error: any }): Promise<void> | void;
};

async function runPipeline(
  route: { middlewares?: HttpMiddleware[]; handler: HttpHandler },
  ctx: HttpContext
): Promise<HttpResponse> {
  for (const middlware of route.middlewares ?? []) {
    await middlware.handle(ctx);
  }
  return route.handler.handle(ctx);
}

export async function executeHttpRoute(
  route: HttpRoute,
  request: HttpRequest,
  reply: HttpReply
): Promise<void> {
  const ctx: HttpContext = {
    request,
    state: {}
  };

  try {
    const result = await runPipeline({ handler: route.handler, middlewares: route.middlewares }, ctx);
    if (result.success) {
      return reply.success({ statusCode: result.statusCode, data: result.data });
    }
    return reply.error({ statusCode: result.statusCode, error: result.error });
  } catch (error) {
    let problemDetails: ProblemDetail;

    if (error instanceof BaseError) {
      problemDetails = error.toProblemDetail();
    } else {
      problemDetails = new InternalServerError(error?.message).toProblemDetail();
    }

    problemDetails.instance = request.requestMeta.path;

    return reply.error({
      statusCode: problemDetails.status,
      error: problemDetails
    });
  }
}
