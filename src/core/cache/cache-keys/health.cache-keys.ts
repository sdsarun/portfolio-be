const PREFIX = "health";

export const HealthCacheKeys = {
  getHealth: `${PREFIX}:status`
} as const;
