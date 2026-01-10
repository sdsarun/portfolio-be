export type CacheSetOptions = {
  ttlSeconds?: number;
};

export type Cache = {
  get<Result = any>(key: string): Promise<Result | null>;
  set(key: string, value: string, options?: CacheSetOptions): Promise<void>;
  del(key: string): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
};
