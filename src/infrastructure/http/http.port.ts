export type HttpAppliaction = {
  listen(options?: { port: number; host?: string }): Promise<void>;
  shutdown(): Promise<void>;
};
