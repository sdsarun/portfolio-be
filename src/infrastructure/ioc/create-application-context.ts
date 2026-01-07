import { type Cache } from "../../core/ports/cache.port";
import { SignInUseCase } from "../../core/usecases/signin/signin.usecase";
import { type HttpRouteDefinition } from "../../adapters/http/http-adapter.port";
import { RequiredTokenMiddleware } from "../../adapters/http/middlewares/required-token.middleware";
import { SignInHandler } from "../../adapters/http/routes/auth/handlers/signin/signin.handler";
import { AuthRoutes } from "../../adapters/http/routes/auth/auth.route";
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
import { UpsertProfileInfoUseCase } from "../../core/usecases/upsert-profile-info/upsert-profile-info.usecase";
import { UpsertProfileResumeUseCase } from "../../core/usecases/upsert-profile-resume/upsert-profile-resume.usecase";
import { UpsertProfileWorkUseCase } from "../../core/usecases/upsert-profile-work/upsert-profile-work.usecase";
import { UpsertProfileContactUseCase } from "../../core/usecases/upsert-profile-contact/upsert-profile-contact.usecase";
import { UpsertProfileInfoHandler } from "../../adapters/http/routes/profile/handlers/upsert-info/upsert-profile-info.handler";
import { UpsertProfileResumeHandler } from "../../adapters/http/routes/profile/handlers/upsert-resume/upsert-profile-resume.handler";
import { UpsertProfileWorkHandler } from "../../adapters/http/routes/profile/handlers/upsert-work/upsert-profile-work.handler";
import { UpsertProfileContactHandler } from "../../adapters/http/routes/profile/handlers/upsert-contact/upsert-profile-contact.handler";
import { GetProfileLatestUpdatedUseCase } from "../../core/usecases/profile-stats/get-profile-latest-updated.usecase";
import { GetProfileLatestStatsHandler } from "../../adapters/http/routes/profile/handlers/get-latest-stats/get-profile-latest-stats.handler";
import { GetProfileInfoUseCase } from "../../core/usecases/get-profile-info/get-profile-info.usecase";
import { GetProfileResumeUseCase } from "../../core/usecases/get-profile-resume/get-profile-resume.usecase";
import { GetProfileWorkUseCase } from "../../core/usecases/get-profile-work/get-profile-work.usecase";
import { GetProfileContactUseCase } from "../../core/usecases/get-profile-contact/get-profile-contact.usecase";
import { GetProfileInfoHandler } from "../../adapters/http/routes/profile/handlers/get-info/get-profile-info.handler";
import { GetProfileResumeHandler } from "../../adapters/http/routes/profile/handlers/get-resume/get-profile-resume.handler";
import { GetProfileWorkHandler } from "../../adapters/http/routes/profile/handlers/get-work/get-profile-work.handler";
import { GetProfileContactHandler } from "../../adapters/http/routes/profile/handlers/get-contact/get-profile-contact.handler";
import { GithubFileStorageRepository } from "../file-storage/github-file-storage.repository";
import { logger } from "../logger/logger";
import { DefaultApiKeyGenerator } from "../security/api-key-generator";
import { Sha256Hasher } from "../security/sha256-hasher";
import { HealthHandler } from "../../adapters/http/routes/health/handlers/health.handler";
import { HealthRoutes } from "../../adapters/http/routes/health/health.route";
import { CreateApiKeyUseCase } from "../../core/usecases/create-api-key/create-api-key.usecase";
import { CreateApiKeyHandler } from "../../adapters/http/routes/api-keys/handlers/create-api-key/create-api-key.handler";
import { ApiKeysRoutes } from "../../adapters/http/routes/api-keys/api-keys.route";
import { GetApiKeysUseCase } from "../../core/usecases/get-api-keys/get-api-keys.usecase";
import { GetApiKeysHandler } from "../../adapters/http/routes/api-keys/handlers/get-api-keys/get-api-keys.handler";
import { DeleteApiKeyByIdUseCase } from "../../core/usecases/delete-api-key-by-id/delete-api-key-by-id.usecase";
import { DeleteApiKeyByIdHandler } from "../../adapters/http/routes/api-keys/handlers/delete-api-key-by-id/delete-api-key-by-id.handler";
import { RevokeApiKeysHandler } from "../../adapters/http/routes/api-keys/handlers/revoke-api-keys/revoke-api-keys.handler";
import { RevokeApiKeysUseCase } from "../../core/usecases/revoke-api-keys/revoke-api-keys.usecase";

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
  const sha256Hasher = new Sha256Hasher();
  const apiKeyGenerator = new DefaultApiKeyGenerator(sha256Hasher);

  // storages
  const githubFileStorageRepository = new GithubFileStorageRepository({
    token: env.GITHUB_TOKEN,
    repoName: env.GITHUB_STORAGE_REPO_NAME,
    apiVersion: env.GITHUB_API_VERSION,
    directoryPath: env.GITHUB_STORAGE_DIRECTORY_PATH,
    branch: env.GITHUB_STORAGE_BRANCH,
    log: {
      debug: logger.debug,
      error: logger.error,
      info: logger.info,
      warn: logger.warn
    }
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
  const getProfileUseCase = new GetProfileUseCase({ uow, authId: env.AUTH_ID });
  const getProfileHandler = new GetProfileHandler({ getProfileUseCase });
  const getProfileInfoUseCase = new GetProfileInfoUseCase({ uow, authId: env.AUTH_ID });
  const getProfileInfoHandler = new GetProfileInfoHandler({ getProfileInfoUseCase });
  const getProfileResumeUseCase = new GetProfileResumeUseCase({ uow, authId: env.AUTH_ID });
  const getProfileResumeHandler = new GetProfileResumeHandler({ getProfileResumeUseCase });
  const getProfileWorkUseCase = new GetProfileWorkUseCase({ uow, authId: env.AUTH_ID });
  const getProfileWorkHandler = new GetProfileWorkHandler({ getProfileWorkUseCase });
  const getProfileContactUseCase = new GetProfileContactUseCase({ uow, authId: env.AUTH_ID });
  const getProfileContactHandler = new GetProfileContactHandler({ getProfileContactUseCase });
  const upsertProfileInfoUseCase = new UpsertProfileInfoUseCase({ uow, authId: env.AUTH_ID });
  const upsertProfileInfoHandler = new UpsertProfileInfoHandler({ upsertProfileInfoUseCase });
  const upsertProfileResumeUseCase = new UpsertProfileResumeUseCase({
    uow,
    authId: env.AUTH_ID
  });
  const upsertProfileResumeHandler = new UpsertProfileResumeHandler({
    upsertProfileResumeUseCase
  });
  const upsertProfileWorkUseCase = new UpsertProfileWorkUseCase({
    uow,
    fileStorageRepository: githubFileStorageRepository,
    authId: env.AUTH_ID
  });
  const upsertProfileWorkHandler = new UpsertProfileWorkHandler({
    upsertProfileWorkUseCase
  });
  const upsertProfileContactUseCase = new UpsertProfileContactUseCase({ uow, authId: env.AUTH_ID });
  const upsertProfileContactHandler = new UpsertProfileContactHandler({
    upsertProfileContactUseCase
  });
  const getProfileLatestUpdatedUseCase = new GetProfileLatestUpdatedUseCase({
    uow,
    authId: env.AUTH_ID
  });
  const getProfileLatestStatsHandler = new GetProfileLatestStatsHandler({
    getProfileLatestUpdatedUseCase
  });
  const profileRoutes = new ProfileRoutes({
    requiredTokenMiddleware,
    getProfileHandler,
    getProfileInfoHandler,
    getProfileResumeHandler,
    getProfileWorkHandler,
    getProfileContactHandler,
    upsertProfileInfoHandler,
    upsertProfileResumeHandler,
    upsertProfileWorkHandler,
    upsertProfileContactHandler,
    getProfileLatestStatsHandler
  });

  // /health
  const healthHandler = new HealthHandler({
    dbCheck: prismaDatabaseHealthCheck,
    pingCheck: fetchHttpPingHealthCheck,
    portfolioSiteUrl: env.PORTFOLIO_SITE_URL
  });
  const healthRoutes = new HealthRoutes({ healthHandler });

  // /api-keys
  const getApiKeysUseCase = new GetApiKeysUseCase({ uow });
  const getApiKeysHandler = new GetApiKeysHandler({ getApiKeysUseCase });

  const createApiKeyUseCase = new CreateApiKeyUseCase({ uow, apiKeyGenerator });
  const createApiKeyHandler = new CreateApiKeyHandler({ createApiKeyUseCase });

  const deleteApiKeyByIdUseCase = new DeleteApiKeyByIdUseCase({ uow });
  const deleteApiKeyByIdHandler = new DeleteApiKeyByIdHandler({ deleteApiKeyByIdUseCase });

  const revokeApiKeysUseCase = new RevokeApiKeysUseCase({ uow });
  const revokeApiKeysHandler = new RevokeApiKeysHandler({ revokeApiKeysUseCase });

  const apiKeysRoutes = new ApiKeysRoutes({
    requiredTokenMiddleware,
    getApiKeysHandler,
    createApiKeyHandler,
    deleteApiKeyByIdHandler,
    revokeApiKeysHandler
  });

  return {
    external: {
      db: prisma,
      cache
    },
    routes: [healthRoutes, authRoutes, profileRoutes, apiKeysRoutes]
  };
}
