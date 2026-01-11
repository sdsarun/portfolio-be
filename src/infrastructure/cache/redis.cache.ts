import { createClient, type RedisClientType } from "redis";
import { type Cache, type CacheSetOptions } from "../../core/ports/cache.port";
import { type Logger } from "../../core/ports/logger.port";

export type RedisInitOptions = {
  url: string;
  logger: Logger;
  prefixKey: string;
};

export class RedisCache implements Cache {
  private static instance: RedisCache | null = null;

  private readonly client: RedisClientType;
  private readonly logger: Logger;
  private readonly prefixKey: string;

  private connectPromise: Promise<any> | null = null;

  constructor(options: RedisInitOptions) {
    this.logger = options.logger;
    this.prefixKey = options.prefixKey;

    this.logger.info({ prefixKey: this.prefixKey, url: options.url }, "RedisCache initializing");

    this.client = createClient({ url: options.url });

    this.client.on("error", (error) => {
      this.logger.error({ error }, "Redis client error");
    });
  }

  static getInstance(options: RedisInitOptions): RedisCache {
    if (!RedisCache.instance) {
      options.logger.info("Creating RedisCache singleton instance");
      RedisCache.instance = new RedisCache(options);
    }
    return RedisCache.instance;
  }

  private async ensureConnected(): Promise<void> {
    if (this.client.isOpen) {
      this.logger.info("Redis already connected");
      return;
    }

    if (this.connectPromise) {
      this.logger.info("Redis connection in progress, waiting");
      await this.connectPromise;
      return;
    }

    this.logger.info("Connecting to Redis");
    this.connectPromise = this.client.connect();

    try {
      await this.connectPromise;
      this.logger.info("Redis connected successfully");
    } catch (error) {
      this.logger.error({ error }, "Redis connection failed");
      throw error;
    } finally {
      this.connectPromise = null;
    }
  }

  async connect(): Promise<void> {
    this.logger.info("Redis connect requested");
    await this.ensureConnected();
  }

  async disconnect(): Promise<void> {
    this.logger.info("Redis disconnect requested");

    try {
      await this.client.quit();
      this.logger.info("Redis disconnected");
    } catch (error) {
      this.logger.error({ error }, "Redis disconnect failed");
      throw error;
    }
  }

  async get<TResult = any>(key: string): Promise<TResult | null> {
    const namespacedKey = this.buildKey(key);

    this.logger.info({ key: namespacedKey }, "Redis GET");

    await this.ensureConnected();

    try {
      const value = await this.client.get(namespacedKey);
      const hit = value !== null;

      this.logger.info({ key: namespacedKey, hit }, "Redis GET result");

      return value ? (JSON.parse(value) as TResult) : null;
    } catch (error) {
      this.logger.error({ error, key: namespacedKey }, "Redis GET failed");
      throw error;
    }
  }

  async set<TValue = any>(key: string, value: TValue, options?: CacheSetOptions): Promise<void> {
    const namespacedKey = this.buildKey(key);
    const ttlSeconds = options?.ttlSeconds;

    this.logger.info({ key: namespacedKey, ttlSeconds }, "Redis SET");

    await this.ensureConnected();

    try {
      const serialized = JSON.stringify(value);

      if (ttlSeconds !== undefined) {
        await this.client.set(namespacedKey, serialized, {
          expiration: { type: "EX", value: ttlSeconds }
        });
      } else {
        await this.client.set(namespacedKey, serialized);
      }

      this.logger.info({ key: namespacedKey }, "Redis SET success");
    } catch (error) {
      this.logger.error({ error, key: namespacedKey }, "Redis SET failed");
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    const namespacedKey = this.buildKey(key);

    this.logger.info({ key: namespacedKey }, "Redis DEL");

    await this.ensureConnected();

    try {
      const deleted = await this.client.del(namespacedKey);

      this.logger.info({ key: namespacedKey, deleted }, "Redis DEL result");
    } catch (error) {
      this.logger.error({ error, key: namespacedKey }, "Redis DEL failed");
      throw error;
    }
  }

  async delPattern(pattern: string): Promise<void> {
    const matchPattern = this.buildKey(pattern);
    let cursor = "0";
    let deletedCount = 0;

    this.logger.info({ matchPattern }, "Redis DEL_PATTERN start");

    await this.ensureConnected();

    try {
      do {
        const result = await this.client.scan(cursor, {
          MATCH: matchPattern,
          COUNT: 100
        });

        cursor = result.cursor;

        if (result.keys.length > 0) {
          const deleted = await this.client.del(result.keys);
          deletedCount += deleted;
          this.logger.info({ batchDeleted: deleted }, "Redis DEL_PATTERN batch delete");
        }
      } while (cursor !== "0");

      this.logger.info({ matchPattern, deletedCount }, "Redis DEL_PATTERN completed");
    } catch (error) {
      this.logger.error({ error, matchPattern }, "Redis DEL_PATTERN failed");
      throw error;
    }
  }

  private buildKey(key: string): string {
    return `${this.prefixKey}:${key}`;
  }
}
