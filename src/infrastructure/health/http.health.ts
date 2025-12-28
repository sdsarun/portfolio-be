import { type HealthStatus, type HttpPingHealthCheck } from "../../core/ports/health-check.port";

export class FetchHttpPingHealthCheck implements HttpPingHealthCheck {
  async ping(url: string): Promise<HealthStatus> {
    try {
      const res = await fetch(url, { method: "GET" });
      return res.ok ? "up" : "down";
    } catch {
      return "down";
    }
  }
}
