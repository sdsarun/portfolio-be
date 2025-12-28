import {
  HttpHandler,
  type HttpMiddleware,
  type HttpRoute,
  type HttpRouteDefinition
} from "../../http-adapter.port";

export class AuthRoutes implements HttpRouteDefinition {
  constructor(
    private readonly requiredTokenMiddleware: HttpMiddleware,
    private readonly signInHandler: HttpHandler,
    private readonly updatePasswordHandler: HttpHandler
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "POST",
        path: "/auth/signin",
        version: 1,
        handler: this.signInHandler
      },
      {
        method: "POST",
        path: "/auth/update-password",
        version: 1,
        middlewares: [this.requiredTokenMiddleware],
        handler: this.updatePasswordHandler
      }
    ];
  }
}
