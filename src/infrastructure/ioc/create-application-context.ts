import { type Cache } from "../../core/ports/cache.port";
import { SignInUseCase } from "../../core/usecases/signin/signin.usecase";
import { type HttpMiddleware, type HttpRouteDefinition } from "../../adapters/http/http-adapter.port";
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

export type ApplicationContext = {
  external: {
    db: ReturnType<typeof DatabaseManager.get>;
    cache: Cache;
  };
  routes: HttpRouteDefinition[];
  middlewares: {
    requiredTokenMiddleware: HttpMiddleware;
  };
};

export function createApplicationContext(): ApplicationContext {
  const prisma = DatabaseManager.get("prisma");
  const cache = new InMemoryCache();

  const uow = new PrismaUnitOfWork(prisma.session());

  // health
  const prismaDatabaseHealthCheck = new PrismaDatabaseHealthCheck(prisma);
  const fetchHttpPingHealthCheck = new FetchHttpPingHealthCheck();

  // services
  const passwordHasher = new Argon2PasswordHasher();
  const tokenCryptor = new JwtTokenCryptor({ secret: env.PASSWORD_PEPPER });

  // middlewares
  const requiredTokenMiddleware = new RequiredTokenMiddleware(tokenCryptor);

  // /auth
  const signInUseCase = new SignInUseCase(uow, passwordHasher, tokenCryptor);
  const signInHandler = new SignInHandler(signInUseCase);
  const updatePasswordHandler = new UpdatePasswordHandler(uow, passwordHasher);
  const authRoutes = new AuthRoutes(requiredTokenMiddleware, signInHandler, updatePasswordHandler);

  // /system
  const healthHandler = new HealthHandler(prismaDatabaseHealthCheck, fetchHttpPingHealthCheck);
  const systemRoutes = new SystemRoutes(healthHandler);

  return {
    external: {
      db: prisma,
      cache
    },
    routes: [systemRoutes, authRoutes],
    middlewares: {
      requiredTokenMiddleware
    }
  };
}
