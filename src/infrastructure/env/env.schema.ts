import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["production", "test", "development"]).default("development"),
  SERVICE_NAME: z.string().default("portfolio-be-by-sdsarun"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.ipv4().default("0.0.0.0"),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_ID: z.uuidv4().min(1, "AUTH_ID is required"),
  PASSWORD_AUTH: z.string().min(1, "PASSWORD_AUTH is required"),
  PASSWORD_PEPPER: z.string().min(1, "PASSWORD_PEPPER is required"),
  TOKEN_EXP: z.string().default("8h"),
  PORTFOLIO_SITE_URL: z.url().default("https://sdsarun.dev")
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(input: NodeJS.ProcessEnv): EnvConfig {
  const parsed = envSchema.safeParse(input);
  if (!parsed.success) {
    console.error("[env] Invalid environment configuration", parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
}
