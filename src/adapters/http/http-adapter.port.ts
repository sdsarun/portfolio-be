import { BaseError, ProblemDetail } from "../../core/errors/base.error";
import { InternalServerError } from "./errors/http.error";

export type HttpRequestInput = {
  body?: any;
  query?: any;
  params?: any;
  headers?: any;
  cookies?: any;
};

export type HttpRequest<TRequestInput extends HttpRequestInput = HttpRequestInput> = {
  body?: TRequestInput["body"];
  query?: TRequestInput["query"];
  params?: TRequestInput["params"];
  headers?: TRequestInput["headers"];
  cookies?: TRequestInput["cookies"];
  requestMeta: {
    path: string;
    ip: string;
    reqId: string;
  };
};

export type HttpResponse<TData = any> = { statusCode: number; data?: TData };

export type HttpContext<
  TRequest extends HttpRequestInput = HttpRequestInput,
  TState = Record<string, any>
> = {
  request: HttpRequest<TRequest>;
  state: TState;
};

export type HttpMiddleware<TContext extends HttpRequestInput = HttpRequestInput> = {
  handle(ctx: HttpContext<TContext>): Promise<void> | void;
};

export type HttpHandler<TContext extends HttpRequestInput = HttpRequestInput, TResponse = any> = {
  handle(ctx: HttpContext<TContext>): Promise<HttpResponse<TResponse>>;
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

    const response: HttpResponse = {
      statusCode: result.statusCode
    };

    if (result?.data) {
      response.data = result.data;
    }

    return reply.success(response);
  } catch (error) {
    let problemDetails: ProblemDetail;

    if (error instanceof BaseError) {
      problemDetails = error.toProblemDetail();
    } else {
      problemDetails = new InternalServerError(error?.message).toProblemDetail();
    }

    problemDetails.instance = request.requestMeta.path;
    problemDetails.refId = request.requestMeta.reqId;

    return reply.error({
      statusCode: problemDetails.status,
      error: problemDetails
    });
  }
}
