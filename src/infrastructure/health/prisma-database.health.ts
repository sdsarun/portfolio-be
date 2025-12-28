import { DatabaseSession } from "../../core/ports/database-session.port";
import { HealthCheck, HealthStatus } from "../../core/ports/health-check.port";

export class PrismaDatabaseHealthCheck implements HealthCheck {
  constructor(private readonly db: DatabaseSession<any>) {}

  async health(): Promise<HealthStatus> {
    try {
      await this.db.rawQuery({
        mode: "select",
        sql: "SELECT 1"
      });
      return "up";
    } catch {
      return "down";
    }
  }
}
