import {
  type HttpMiddleware,
  type HttpRoute,
  type HttpRouteDefinition
} from "../../http-adapter.port";
import { type SignInHandlerPort } from "./handlers/signin/signin.handler";
import { type UpdatePasswordHandlerPort } from "./handlers/update-password/update-password.handler";

export class AuthRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      requiredTokenMiddleware: HttpMiddleware;
      signInHandler: SignInHandlerPort;
      updatePasswordHandler: UpdatePasswordHandlerPort;
    }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "POST",
        path: "/auth/signin",
        version: 1,
        handler: this.deps.signInHandler
      },
      {
        method: "POST",
        path: "/auth/update-password",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.updatePasswordHandler
      }
    ];
  }
}
