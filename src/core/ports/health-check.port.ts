export type HealthStatus = "up" | "down";
export type HealthCheck = {
  health(): Promise<HealthStatus>;
};

export type HttpPingHealthCheck = {
  ping(url: string): Promise<HealthStatus>;
};
