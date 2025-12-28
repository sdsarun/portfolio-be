import { type HttpHandler, type HttpResponse } from "../../../../http-adapter.port";
import {
  type HttpPingHealthCheck,
  type HealthCheck
} from "../../../../../../core/ports/health-check.port";

export type HealthHandlerPort = HttpHandler;

export class HealthHandler implements HttpHandler {
  constructor(
    private readonly deps: {
      dbCheck: HealthCheck;
      pingCheck: HttpPingHealthCheck;
      portfolioSiteUrl: string;
    }
  ) {}

  async handle(): Promise<HttpResponse> {
    const [database, portfolioSite] = await Promise.all([
      this.deps.dbCheck.health(),
      this.deps.pingCheck.ping(this.deps.portfolioSiteUrl)
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
