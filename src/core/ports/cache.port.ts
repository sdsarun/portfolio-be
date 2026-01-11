export type CacheSetOptions = {
  ttlSeconds?: number;
};

export type Cache = {
  get<TResult = any>(key: string): Promise<TResult | null>;
  set<TValue = any>(key: string, value: TValue, options?: CacheSetOptions): Promise<void>;
  del(key: string): Promise<void>;
  delPattern(key: string): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
};
