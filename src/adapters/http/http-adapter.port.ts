import { BaseError, type ProblemDetail } from "../../core/errors/base.error";
import { InternalServerError } from "./errors/http.error";
import { type Cache } from "../../core/ports/cache.port";

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
  handle(ctx: HttpContext<TContext>): Promise<void>;
};

export type HttpHandler<TContext extends HttpRequestInput = HttpRequestInput, TResponse = any> = {
  handle(ctx: HttpContext<TContext>): Promise<HttpResponse<TResponse>>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type HttpCache = {
  ttlSeconds?: number;
  key?: string | ((ctx: HttpContext) => string);
  invalidate?: string[] | ((ctx: HttpContext) => string[]);
};

export type HttpRoute = {
  method: HttpMethod;
  path: string;
  version?: number;
  handler: HttpHandler;
  middlewares?: HttpMiddleware[];
  cache?: HttpCache;
};

export type HttpRouteDefinition = {
  routes(): HttpRoute[];
};

export type HttpReply = {
  success(response: { statusCode: number; data?: any }): Promise<void> | void;
  error(response: { statusCode: number; error: any }): Promise<void> | void;
  setHeaders(headers: Record<string, number | string>): Promise<void> | void;
};

export type HttpRouteServices = {
  cache: Cache;
};

async function runPipeline(
  ctx: HttpContext,
  route: HttpRoute,
  services: HttpRouteServices
): Promise<{ cacheHit: boolean; result: HttpResponse }> {
  const { cache } = services;

  for (const middlware of route.middlewares ?? []) {
    await middlware.handle(ctx);
  }

  if (route.method === "GET" && route?.cache?.key) {
    const { key } = route.cache;
    const cahceKey = typeof key === "function" ? key(ctx) : key;
    const cached = await cache.get(cahceKey);
    if (cached) {
      return { cacheHit: true, result: cached };
    }
  }

  return { cacheHit: false, result: await route.handler.handle(ctx) };
}

export async function executeHttpRoute(
  route: HttpRoute,
  request: HttpRequest,
  reply: HttpReply,
  services: HttpRouteServices
): Promise<void> {
  const { cache } = services;

  const ctx: HttpContext = {
    request,
    state: {}
  };

  try {
    const { cacheHit, result } = await runPipeline(ctx, route, services);

    const response: HttpResponse = {
      statusCode: result.statusCode
    };

    if (result?.data) {
      response.data = result.data;
    }

    if (route.method === "GET" && route?.cache?.key && route?.cache?.ttlSeconds && !cacheHit) {
      const { key, ttlSeconds } = route.cache;
      const cacheKey = typeof key === "function" ? key(ctx) : key;
      await cache.set(cacheKey, result, { ttlSeconds });
    }

    if (route.method !== "GET" && route?.cache?.invalidate) {
      const keys =
        typeof route.cache.invalidate === "function"
          ? route.cache.invalidate(ctx)
          : route.cache.invalidate;

      for (const key of keys) {
        await cache.delPattern(key);
      }
    }

    reply.setHeaders({
      "x-cache": cacheHit ? "HIT" : "MISS"
    });

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
