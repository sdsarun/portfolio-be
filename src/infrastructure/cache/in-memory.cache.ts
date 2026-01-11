import { type Cache, type CacheSetOptions } from "../../core/ports/cache.port";
import { type Logger } from "../../core/ports/logger.port";

export type InMemoryInitOptions = {
  logger: Logger;
  prefixKey: string;
};

export class InMemoryCache implements Cache {
  private readonly memo = new Map<string, { value: string; expiredAt: number }>();
  private readonly defaultTtlSeconds = 60;
  private readonly logger: Logger;
  private readonly prefixKey: string;

  private cleanupTimer: NodeJS.Timeout;

  constructor(options: InMemoryInitOptions) {
    this.logger = options.logger;
    this.prefixKey = options.prefixKey;

    this.logger.info({ prefixKey: this.prefixKey }, "InMemoryCache initializing");

    this.cleanupTimer = setInterval(() => {
      this.sweepExpired();
    }, 60_000);

    this.cleanupTimer.unref();
  }

  async connect(): Promise<void> {
    this.logger.info("InMemoryCache connect (no-op)");
  }

  async disconnect(): Promise<void> {
    clearInterval(this.cleanupTimer);
    this.logger.info("InMemoryCache disconnected");
  }

  async get<TResult = any>(key: string): Promise<TResult | null> {
    const namespacedKey = this.buildKey(key);
    this.logger.info({ key: namespacedKey }, "InMemory GET");

    const entry = this.memo.get(namespacedKey);
    if (!entry) {
      this.logger.info({ key: namespacedKey, hit: false }, "InMemory GET miss");
      return null;
    }

    if (Date.now() > entry.expiredAt) {
      this.memo.delete(namespacedKey);
      this.logger.info({ key: namespacedKey, expired: true }, "InMemory GET expired");
      return null;
    }

    try {
      const value = JSON.parse(entry.value) as TResult;
      this.logger.info({ key: namespacedKey, hit: true }, "InMemory GET hit");
      return value;
    } catch (error) {
      this.logger.error({ error, key: namespacedKey }, "InMemory GET parse failed");
      return null;
    }
  }

  async set<TValue = any>(key: string, value: TValue, options?: CacheSetOptions): Promise<void> {
    const namespacedKey = this.buildKey(key);
    const ttl = options?.ttlSeconds ?? this.defaultTtlSeconds;

    this.logger.info({ key: namespacedKey, ttl }, "InMemory SET");

    if (ttl <= 0) {
      this.memo.delete(namespacedKey);
      this.logger.info({ key: namespacedKey }, "InMemory SET skipped (ttl <= 0)");
      return;
    }

    this.memo.set(namespacedKey, {
      value: JSON.stringify(value),
      expiredAt: Date.now() + ttl * 1000
    });

    this.logger.info({ key: namespacedKey }, "InMemory SET success");
  }

  async del(key: string): Promise<void> {
    const namespacedKey = this.buildKey(key);
    const existed = this.memo.delete(namespacedKey);

    this.logger.info({ key: namespacedKey, existed }, "InMemory DEL");
  }

  async delPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern);
    let deletedCount = 0;

    this.logger.info({ pattern }, "InMemory DEL_PATTERN start");

    for (const key of this.memo.keys()) {
      if (regex.test(key)) {
        this.memo.delete(key);
        deletedCount++;
      }
    }

    this.logger.info({ pattern, deletedCount }, "InMemory DEL_PATTERN completed");
  }

  private buildKey(key: string): string {
    return `${this.prefixKey}:${key}`;
  }

  private sweepExpired(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.memo) {
      if (now > entry.expiredAt) {
        this.memo.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      this.logger.info({ removed }, "InMemory expired entries swept");
    }
  }
}
