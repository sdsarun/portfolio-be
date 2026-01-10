import { createClient, type RedisClientType } from "redis";
import { type Cache, type CacheSetOptions } from "../../core/ports/cache.port";
import { type Logger } from "../../core/ports/logger.port";

export type RedisInitOptions = {
  url: string;
  logger: Logger;
};

export class RedisCache implements Cache {
  private static instance: RedisCache | null = null;

  private readonly client: RedisClientType;
  private readonly logger: Logger;
  private connectPromise: Promise<any> | null = null;

  constructor(options: RedisInitOptions) {
    this.logger = options.logger;

    this.logger.info("Initializing RedisCache");

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
      this.logger.error({ error }, "Failed to connect to Redis");
      throw error;
    } finally {
      this.connectPromise = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    this.logger.info({ key }, "Redis GET");

    await this.ensureConnected();

    try {
      const value = await this.client.get(key);
      this.logger.info({ key, hit: Boolean(value) }, "Redis GET result");
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.error({ key, error }, "Redis GET failed");
      throw error;
    }
  }

  async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    this.logger.info({ key, options }, "Redis SET");

    await this.ensureConnected();

    try {
      const serialized = JSON.stringify(value);

      if (options?.ttlSeconds) {
        await this.client.set(key, serialized, { EX: options.ttlSeconds });
      } else {
        await this.client.set(key, serialized);
      }

      this.logger.info({ key }, "Redis SET success");
    } catch (error) {
      this.logger.error({ key, error }, "Redis SET failed");
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    this.logger.info({ key }, "Redis DEL");

    await this.ensureConnected();

    try {
      await this.client.del(key);
      this.logger.info({ key }, "Redis DEL success");
    } catch (error) {
      this.logger.error({ key, error }, "Redis DEL failed");
      throw error;
    }
  }

  async connect(): Promise<void> {
    this.logger.info("Redis connect requested");
    await this.ensureConnected();
  }

  async disconnect(): Promise<void> {
    this.logger.info("Disconnecting Redis");

    try {
      await this.client.quit();
      this.logger.info("Redis disconnected");
    } catch (error) {
      this.logger.error({ error }, "Redis disconnect failed");
      throw error;
    }
  }
}
