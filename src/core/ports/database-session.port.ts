export type RawQueryMode = "select" | "mutation";
export type RawQueryResult<Row = any> =
  | { type: "select"; rows: Row[] }
  | { type: "mutation"; affectedRows: number };

export type DatabaseSession<Session> = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  session(): Session;
  transaction<Result>(fn: (tx: Session) => Promise<Result>): Promise<Result>;
  rawQuery<Row = any>(params: {
    sql: string;
    mode: RawQueryMode;
    values?: readonly any[];
  }): Promise<RawQueryResult<Row>>;
};
