import { type Cache, type CacheSetOptions } from "../../core/ports/cache.port";

export class InMemoryCache implements Cache {
  private readonly memo = new Map<string, { value: string; expiredAt: number }>();
  private readonly defaultTtlSeconds: number = 60;
  private cleanupTimer: NodeJS.Timeout;

  constructor() {
    this.cleanupTimer = setInterval(() => {
      this.sweepExpired();
    }, 60_000); // 1 min
    this.cleanupTimer.unref();
  }

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async get<Result = any>(key: string): Promise<Result | null> {
    try {
      const exists = this.memo.has(key);
      if (!exists) {
        return null;
      }

      const { value: rawValue, expiredAt } = this.memo.get(key)!;
      if (Date.now() > expiredAt) {
        this.memo.delete(key);
        return null;
      }

      const parsedValue = JSON.parse(rawValue);
      return parsedValue as Result;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, options?: CacheSetOptions): Promise<void> {
    const ttl = options?.ttlSeconds ?? this.defaultTtlSeconds;

    if (ttl <= 0) {
      this.memo.delete(key);
      return;
    }

    this.memo.set(key, {
      value: JSON.stringify(value),
      expiredAt: Date.now() + ttl * 1000
    });
  }

  async del(key: string): Promise<void> {
    this.memo.delete(key);
  }

  private sweepExpired() {
    const now = Date.now();
    for (const [key, entry] of this.memo) {
      if (now > entry.expiredAt) {
        this.memo.delete(key);
      }
    }
  }
}
