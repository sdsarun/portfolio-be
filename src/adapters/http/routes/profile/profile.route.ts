import {
  type HttpHandler,
  type HttpMiddleware,
  type HttpRoute,
  type HttpRouteDefinition
} from "../../http-adapter.port";

export class ProfileRoutes implements HttpRouteDefinition {
  constructor(
    private readonly requiredTokenMiddleware: HttpMiddleware,
    private readonly getProfileHandler: HttpHandler
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "GET",
        path: "/profile",
        middlewares: [this.requiredTokenMiddleware],
        handler: this.getProfileHandler
      }
    ];
  }
}
