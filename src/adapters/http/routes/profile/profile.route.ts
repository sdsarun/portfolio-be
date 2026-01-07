import { type HttpMiddleware, type HttpRoute, type HttpRouteDefinition } from "../../http-adapter.port";
import { type GetProfileHandlerPort } from "./handlers/get-profile/get-profile.handler";
import { type UpsertProfileInfoHandlerPort } from "./handlers/upsert-info/upsert-profile-info.handler";
import { type UpsertProfileResumeHandlerPort } from "./handlers/upsert-resume/upsert-profile-resume.handler";
import { type UpsertProfileWorkHandlerPort } from "./handlers/upsert-work/upsert-profile-work.handler";
import { type UpsertProfileContactHandlerPort } from "./handlers/upsert-contact/upsert-profile-contact.handler";
import { type GetProfileLatestStatusHandlerPort } from "./handlers/get-latest-stats/get-profile-latest-stats.handler";
import { type GetProfileInfoHandlerPort } from "./handlers/get-info/get-profile-info.handler";
import { type GetProfileResumeHandlerPort } from "./handlers/get-resume/get-profile-resume.handler";
import { type GetProfileWorkHandlerPort } from "./handlers/get-work/get-profile-work.handler";
import { type GetProfileContactHandlerPort } from "./handlers/get-contact/get-profile-contact.handler";

export class ProfileRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      requiredTokenMiddleware: HttpMiddleware;
      getProfileHandler: GetProfileHandlerPort;
      getProfileInfoHandler: GetProfileInfoHandlerPort;
      getProfileResumeHandler: GetProfileResumeHandlerPort;
      getProfileWorkHandler: GetProfileWorkHandlerPort;
      getProfileContactHandler: GetProfileContactHandlerPort;
      getProfileLatestStatusHandler: GetProfileLatestStatusHandlerPort;
      upsertProfileInfoHandler: UpsertProfileInfoHandlerPort;
      upsertProfileResumeHandler: UpsertProfileResumeHandlerPort;
      upsertProfileWorkHandler: UpsertProfileWorkHandlerPort;
      upsertProfileContactHandler: UpsertProfileContactHandlerPort;
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
        handler: this.deps.getProfileLatestStatusHandler
      },
      {
        method: "PUT",
        path: "/profile/info",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileInfoHandler
      },
      {
        method: "GET",
        path: "/profile/info",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getProfileInfoHandler
      },
      {
        method: "PUT",
        path: "/profile/resume",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileResumeHandler
      },
      {
        method: "GET",
        path: "/profile/resume",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getProfileResumeHandler
      },
      {
        method: "PUT",
        path: "/profile/work",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileWorkHandler
      },
      {
        method: "GET",
        path: "/profile/work",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getProfileWorkHandler
      },
      {
        method: "PUT",
        path: "/profile/contact",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.upsertProfileContactHandler
      },
      {
        method: "GET",
        path: "/profile/contact",
        version: 1,
        middlewares: [this.deps.requiredTokenMiddleware],
        handler: this.deps.getProfileContactHandler
      }
    ];
  }
}
