import { type HttpMiddleware, type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type GetProfileHandlerPort } from "./handlers/get-profile/get-profile.handler";
import { type UpsertProfileInfoHandlerPort } from "./handlers/upsert-info/upsert-profile-info.handler";
import { type UpsertProfileResumeHandlerPort } from "./handlers/upsert-resume/upsert-profile-resume.handler";
import { type UpsertProfileWorkHandlerPort } from "./handlers/upsert-work/upsert-profile-work.handler";
import { type UpsertProfileContactHandlerPort } from "./handlers/upsert-contact/upsert-profile-contact.handler";
import { type GetProfileLatestStatsHandlerPort } from "./handlers/get-latest-stats/get-profile-latest-stats.handler";

export class ProfileRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      requiredTokenMiddleware: HttpMiddleware;
      getProfileHandler: GetProfileHandlerPort;
      upsertProfileInfoHandler: UpsertProfileInfoHandlerPort;
      upsertProfileResumeHandler: UpsertProfileResumeHandlerPort;
      upsertProfileWorkHandler: UpsertProfileWorkHandlerPort;
      upsertProfileContactHandler: UpsertProfileContactHandlerPort;
      getProfileLatestStatsHandler: GetProfileLatestStatsHandlerPort;
    }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "GET",
        path: "/profile",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getProfileHandler
      },
      {
        method: "GET",
        path: "/profile/latest-updated",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getProfileLatestStatsHandler
      },
      {
        method: "PUT",
        path: "/profile/info",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileInfoHandler
      },
      {
        method: "PUT",
        path: "/profile/resume",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileResumeHandler
      },
      {
        method: "PUT",
        path: "/profile/work",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileWorkHandler
      },
      {
        method: "PUT",
        path: "/profile/contact",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileContactHandler
      }
    ];
  }
}
