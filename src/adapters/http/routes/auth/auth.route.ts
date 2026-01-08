import { type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type AccessControlMiddleware } from "../../middlewares/auth/access-control.middleware";
import { type SignInHandlerPort } from "./handlers/signin/signin.handler";
import { type UpdatePasswordHandlerPort } from "./handlers/update-password/update-password.handler";

export class AuthRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      accessControlMiddleware: AccessControlMiddleware;
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
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer"] })],
        handler: this.deps.updatePasswordHandler
      }
    ];
  }
}
