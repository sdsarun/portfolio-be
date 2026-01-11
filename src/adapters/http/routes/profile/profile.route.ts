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
import { type AccessControlMiddleware } from "../../middlewares/auth/access-control.middleware";
import { ProfileCacheKeys } from "../../../../core/cache/cache-keys/profile.cache-keys";

export class ProfileRoutes implements HttpRouteDefinition {
  constructor(
    private readonly deps: {
      accessControlMiddleware: AccessControlMiddleware;
      getProfileHandler: GetProfileHandlerPort;
      getProfileInfoHandler: GetProfileInfoHandlerPort;
      getProfileResumeHandler: GetProfileResumeHandlerPort;
      getProfileWorkHandler: GetProfileWorkHandlerPort;
      getProfileContactHandler: GetProfileContactHandlerPort;
      getProfileLatestStatusHandler: GetProfileLatestStatusHandlerPort;
      getProfileLatestStatusRequestValidator: HttpMiddleware;
      upsertProfileInfoHandler: UpsertProfileInfoHandlerPort;
      upsertProfileInfoRequestValidator: HttpMiddleware;
      upsertProfileResumeHandler: UpsertProfileResumeHandlerPort;
      upsertProfileResumeRequestValidator: HttpMiddleware;
      upsertProfileWorkHandler: UpsertProfileWorkHandlerPort;
      upsertProfileWorkRequestValidator: HttpMiddleware;
      upsertProfileContactHandler: UpsertProfileContactHandlerPort;
      upsertProfileContactRequestValidator: HttpMiddleware;
    }
  ) {}

  routes(): HttpRoute[] {
    return [
      {
        method: "GET",
        path: "/profile",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] })],
        handler: this.deps.getProfileHandler,
        cache: {
          key: ProfileCacheKeys.getProfile,
          ttlSeconds: 60 * 60
        }
      },
      {
        method: "GET",
        path: "/profile/latest-updated",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] }),
          this.deps.getProfileLatestStatusRequestValidator
        ],
        handler: this.deps.getProfileLatestStatusHandler,
        cache: {
          key: ProfileCacheKeys.getProfileLatestStatus,
          ttlSeconds: 60 * 60
        }
      },
      {
        method: "PUT",
        path: "/profile/info",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] }),
          this.deps.upsertProfileInfoRequestValidator
        ],
        handler: this.deps.upsertProfileInfoHandler,
        cache: {
          invalidate: [ProfileCacheKeys.allPattern]
        }
      },
      {
        method: "GET",
        path: "/profile/info",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] })],
        handler: this.deps.getProfileInfoHandler,
        cache: {
          key: ProfileCacheKeys.getProfileInfo,
          ttlSeconds: 60 * 60
        }
      },
      {
        method: "PUT",
        path: "/profile/resume",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] }),
          this.deps.upsertProfileResumeRequestValidator
        ],
        handler: this.deps.upsertProfileResumeHandler,
        cache: {
          invalidate: [ProfileCacheKeys.allPattern]
        }
      },
      {
        method: "GET",
        path: "/profile/resume",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] })],
        handler: this.deps.getProfileResumeHandler,
        cache: {
          key: ProfileCacheKeys.getProfileResume,
          ttlSeconds: 60 * 60
        }
      },
      {
        method: "PUT",
        path: "/profile/work",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] }),
          this.deps.upsertProfileWorkRequestValidator
        ],
        handler: this.deps.upsertProfileWorkHandler,
        cache: {
          invalidate: [ProfileCacheKeys.allPattern]
        }
      },
      {
        method: "GET",
        path: "/profile/work",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] })],
        handler: this.deps.getProfileWorkHandler,
        cache: {
          key: ProfileCacheKeys.getProfileWork,
          ttlSeconds: 60 * 60
        }
      },
      {
        method: "PUT",
        path: "/profile/contact",
        version: 1,
        middlewares: [
          this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] }),
          this.deps.upsertProfileContactRequestValidator
        ],
        handler: this.deps.upsertProfileContactHandler,
        cache: {
          invalidate: [ProfileCacheKeys.allPattern]
        }
      },
      {
        method: "GET",
        path: "/profile/contact",
        version: 1,
        middlewares: [this.deps.accessControlMiddleware.build({ methods: ["bearer", "api-key"] })],
        handler: this.deps.getProfileContactHandler,
        cache: {
          key: ProfileCacheKeys.getProfileContact,
          ttlSeconds: 60 * 60
        }
      }
    ];
  }
}
