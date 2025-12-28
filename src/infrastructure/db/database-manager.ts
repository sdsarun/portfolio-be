import { type DatabaseSession } from "../../core/ports/database-session.port";
import { PrismaDatabaseSession, type PrismaClientOrTransaction } from "./prisma/prisma-database-session";
import { env } from "../env/env.config";

export type DatabaseBackends = {
  prisma: DatabaseSession<PrismaClientOrTransaction>;
};

export type DatabaseBackendName = keyof DatabaseBackends;

export class DatabaseManager {
  private static sessions: Partial<DatabaseBackends> = {};

  static get<Name extends DatabaseBackendName>(backend: Name): DatabaseBackends[Name] {
    const existing = this.sessions[backend];
    if (existing) {
      return existing;
    }

    const created = this.create(backend);
    this.sessions[backend] = created;
    return created;
  }

  static async getConnected<Name extends DatabaseBackendName>(
    backend: Name
  ): Promise<DatabaseBackends[Name]> {
    const session = this.get(backend);
    await session.connect();
    return session;
  }

  static async close<Name extends DatabaseBackendName>(backend: Name): Promise<void> {
    const session = this.sessions[backend];
    if (!session) {
      return;
    }

    await session.disconnect();
    delete this.sessions[backend];
  }

  static async closeAll(): Promise<void> {
    const sessions = Object.entries(this.sessions).filter(
      (entry): entry is [string, DatabaseSession<any>] => Boolean(entry[1])
    );
    await Promise.allSettled(sessions.map(([, session]) => session.disconnect()));
    this.sessions = {};
  }

  private static create<Name extends DatabaseBackendName>(backend: Name): DatabaseBackends[Name] {
    switch (backend) {
      case "prisma":
        return new PrismaDatabaseSession(env.DATABASE_URL) as DatabaseBackends[Name];

      default: {
        throw new Error(`Unsupported database backend: ${String(backend)}`);
      }
    }
  }
}
