import { env } from "../env/env.config";

export type CorsConfig = {
  origin?: string | string[];
  credentials?: boolean;
  exposedHeaders?: string | string[];
  allowedHeaders?: string | string[];
  methods?: string | string[];
  maxAge?: number;
};

function parseOrigins(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getCorsConfig(): CorsConfig {
  return {
    origin: parseOrigins(env.CORS_ALLOWED_ORIGIN),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Accept", "Content-Type", "Authorization", "Origin", "Accept-Language"],
    maxAge: env.CORS_MAX_AGE
  };
}
