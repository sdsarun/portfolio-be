import { type Cache } from "../../core/ports/cache.port";
import { SignInUseCase } from "../../core/usecases/signin/signin.usecase";
import { type HttpRouteDefinition } from "../../adapters/http/http-adapter.port";
import { RequiredTokenMiddleware } from "../../adapters/http/middlewares/required-token.middleware";
import { SignInHandler } from "../../adapters/http/routes/auth/handlers/signin/signin.handler";
import { AuthRoutes } from "../../adapters/http/routes/auth/auth.route";
import { HealthHandler } from "../../adapters/http/routes/system/handlers/health/health.handler";
import { SystemRoutes } from "../../adapters/http/routes/system/system.route";
import { env } from "../env/env.config";
import { Argon2PasswordHasher } from "../security/argon2.password-hasher";
import { JwtTokenCryptor } from "../security/jwt.token-cryptor";
import { DatabaseManager } from "../db/database-manager";
import { PrismaUnitOfWork } from "../db/prisma/prisma-unit-of-work";
import { InMemoryCache } from "../cache/in-memory.cache";
import { PrismaDatabaseHealthCheck } from "../health/prisma-database.health";
import { FetchHttpPingHealthCheck } from "../health/http.health";
import { UpdatePasswordHandler } from "../../adapters/http/routes/auth/handlers/update-password/update-password.handler";
import { UpdatePasswordUseCase } from "../../core/usecases/update-password/update-password.usecase";
import { GetProfileUseCase } from "../../core/usecases/get-profile/get-profile.usecase";
import { GetProfileHandler } from "../../adapters/http/routes/profile/handlers/get-profile/get-profile.handler";
import { ProfileRoutes } from "../../adapters/http/routes/profile/profile.route";
import { UpsertProfileInfoUseCase } from "../../core/usecases/upsert-profile/upsert-profile-info.usecase";
import { UpsertProfileResumeUseCase } from "../../core/usecases/upsert-profile/upsert-profile-resume.usecase";
import { UpsertProfileWorkUseCase } from "../../core/usecases/upsert-profile/upsert-profile-work.usecase";
import { UpsertProfileContactUseCase } from "../../core/usecases/upsert-profile/upsert-profile-contact.usecase";
import { UpsertProfileInfoHandler } from "../../adapters/http/routes/profile/handlers/upsert-info/upsert-profile-info.handler";
import { UpsertProfileResumeHandler } from "../../adapters/http/routes/profile/handlers/upsert-resume/upsert-profile-resume.handler";
import { UpsertProfileWorkHandler } from "../../adapters/http/routes/profile/handlers/upsert-work/upsert-profile-work.handler";
import { UpsertProfileContactHandler } from "../../adapters/http/routes/profile/handlers/upsert-contact/upsert-profile-contact.handler";

export type ApplicationContext = {
  external: {
    db: ReturnType<typeof DatabaseManager.get>;
    cache: Cache;
  };
  routes: HttpRouteDefinition[];
};

export function createApplicationContext(): ApplicationContext {
  const prisma = DatabaseManager.get("prisma");
  const cache = new InMemoryCache();

  const uow = new PrismaUnitOfWork({ prisma: prisma.session() });

  // health
  const prismaDatabaseHealthCheck = new PrismaDatabaseHealthCheck({ db: prisma });
  const fetchHttpPingHealthCheck = new FetchHttpPingHealthCheck();

  // services
  const passwordHasher = new Argon2PasswordHasher({ pepper: env.PASSWORD_PEPPER });
  const tokenCryptor = new JwtTokenCryptor({
    secret: env.PASSWORD_PEPPER,
    defaultExpiresIn: env.TOKEN_EXP,
    defaultIssuer: env.SERVICE_NAME
  });

  // middlewares
  const requiredTokenMiddleware = new RequiredTokenMiddleware({ tokenCryptor });

  // /auth
  const signInUseCase = new SignInUseCase({ uow, passwordHasher, tokenCryptor });
  const signInHandler = new SignInHandler({ signInUseCase });
  const updatePasswordUseCase = new UpdatePasswordUseCase({
    uow,
    passwordHasher,
    authId: env.AUTH_ID
  });
  const updatePasswordHandler = new UpdatePasswordHandler({ updatePasswordUseCase });
  const authRoutes = new AuthRoutes({
    requiredTokenMiddleware,
    signInHandler,
    updatePasswordHandler
  });

  // /profile
  const getProfileUseCase = new GetProfileUseCase({ uow });
  const getProfileHandler = new GetProfileHandler({ getProfileUseCase });
  const upsertProfileInfoUseCase = new UpsertProfileInfoUseCase({ uow, authId: env.AUTH_ID });
  const upsertProfileInfoHandler = new UpsertProfileInfoHandler({ upsertProfileInfoUseCase });
  const upsertProfileResumeUseCase = new UpsertProfileResumeUseCase({
    uow,
    authId: env.AUTH_ID
  });
  const upsertProfileResumeHandler = new UpsertProfileResumeHandler({
    upsertProfileResumeUseCase
  });
  const upsertProfileWorkUseCase = new UpsertProfileWorkUseCase({ uow, authId: env.AUTH_ID });
  const upsertProfileWorkHandler = new UpsertProfileWorkHandler({
    upsertProfileWorkUseCase
  });
  const upsertProfileContactUseCase = new UpsertProfileContactUseCase({ uow, authId: env.AUTH_ID });
  const upsertProfileContactHandler = new UpsertProfileContactHandler({
    upsertProfileContactUseCase
  });
  const profileRoutes = new ProfileRoutes({
    requiredTokenMiddleware,
    getProfileHandler,
    upsertProfileInfoHandler,
    upsertProfileResumeHandler,
    upsertProfileWorkHandler,
    upsertProfileContactHandler
  });

  // /system
  const healthHandler = new HealthHandler({
    dbCheck: prismaDatabaseHealthCheck,
    pingCheck: fetchHttpPingHealthCheck,
    portfolioSiteUrl: env.PORTFOLIO_SITE_URL
  });
  const systemRoutes = new SystemRoutes({ healthHandler });

  return {
    external: {
      db: prisma,
      cache
    },
    routes: [systemRoutes, authRoutes, profileRoutes]
  };
}
