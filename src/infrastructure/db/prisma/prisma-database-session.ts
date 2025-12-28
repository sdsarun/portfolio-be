import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import {
  type DatabaseSession,
  type RawQueryMode,
  type RawQueryResult
} from "../../../core/ports/database-session.port";

export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;

export class PrismaDatabaseSession implements DatabaseSession<PrismaClientOrTransaction> {
  private readonly client: PrismaClient;

  constructor(connectionString: string) {
    const adapter = new PrismaPg({ connectionString });
    this.client = new PrismaClient({ adapter });
  }

  async rawQuery<Row = any>(params: {
    sql: string;
    mode: RawQueryMode;
    values?: readonly any[];
  }): Promise<RawQueryResult<Row>> {
    const { sql, mode, values = [] } = params;
    if (mode === "select") {
      const rows = await this.client.$queryRawUnsafe<Row[]>(sql, ...values);
      return { type: "select", rows };
    }
    const affectedRows = await this.client.$executeRawUnsafe(sql, ...values);
    return { type: "mutation", affectedRows };
  }

  async connect(): Promise<void> {
    await this.client.$connect();
    await this.tryQuery();
  }

  async disconnect(): Promise<void> {
    return this.client.$disconnect();
  }

  session(): PrismaClientOrTransaction {
    return this.client;
  }

  async transaction<Result>(fn: (tx: PrismaClientOrTransaction) => Promise<Result>): Promise<Result> {
    return this.client.$transaction(fn);
  }

  private async tryQuery() {
    return this.client.$queryRaw`SELECT 1`;
  }
}
