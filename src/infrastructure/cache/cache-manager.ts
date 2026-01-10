import { type Cache } from "../../core/ports/cache.port";
import { env } from "../env/env.config";
import { logger } from "../logger/logger";
import { InMemoryCache } from "./in-memory.cache";
import { RedisCache } from "./redis.cache";

export type CacheBackends = {
  memory: Cache;
  redis: Cache;
};

export type CacheBackendName = keyof CacheBackends;

export class CacheManager {
  private static sessions: Partial<CacheBackends> = {};

  static get<Name extends CacheBackendName>(backend: Name): Cache {
    const existing = this.sessions[backend];
    if (existing) {
      return existing;
    }
    const created = this.create(backend);
    this.sessions[backend] = created;
    return created;
  }

  static async getConnected<Name extends CacheBackendName>(backend: Name): Promise<CacheBackends[Name]> {
    const session = this.get(backend);
    await session.connect();
    return session;
  }

  static async close<Name extends CacheBackendName>(backend: Name): Promise<void> {
    const session = this.sessions[backend];
    if (!session) {
      return;
    }

    await session.disconnect();
    delete this.sessions[backend];
  }

  static async closeAll(): Promise<void> {
    const sessions = Object.entries(this.sessions).filter((entry) => Boolean(entry[1]));
    await Promise.allSettled(sessions.map(([, session]) => session.disconnect()));
    this.sessions = {};
  }

  private static create<Name extends CacheBackendName>(backend: Name): CacheBackends[Name] {
    switch (backend) {
      case "memory":
        return new InMemoryCache();
      case "redis": {
        return new RedisCache({ url: env.REDIS_URL, logger: logger });
      }
      default:
        throw new Error(`Unsupported cache backend: ${String(backend)}`);
    }
  }
}
