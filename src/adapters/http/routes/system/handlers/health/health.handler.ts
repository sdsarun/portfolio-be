import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import {
  type HttpPingHealthCheck,
  type HealthCheck
} from "../../../../../../core/ports/health-check.port";
import { env } from "../../../../../../infrastructure/env/env.config";

export class HealthHandler implements HttpHandler {
  constructor(
    private readonly dbCheck: HealthCheck,
    private readonly pingCheck: HttpPingHealthCheck
  ) {}

  async handle(): Promise<HttpResponse> {
    const [database, portfolioSite] = await Promise.all([
      this.dbCheck.health(),
      this.pingCheck.ping(env.PORTFOLIO_SITE_URL)
    ]);

    return {
      success: true,
      data: {
        ts: Date.now(),
        services: {
          database,
          portfolioSite
        }
      },
      statusCode: 200
    };
  }
}
