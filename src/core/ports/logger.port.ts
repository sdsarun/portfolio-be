export type LogObject = Record<string, unknown>;

export type Logger = {
  trace(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  fatal(...args: any[]): void;

  // Optional: not every logger supports this
  child?(bindings: LogObject): Logger;
};
