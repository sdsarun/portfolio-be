import { z } from "zod";

export const envSchema = z
  .object({
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
    PORTFOLIO_SITE_URL: z.url().default("https://sdsarun.dev"),
    CORS_ALLOWED_ORIGIN: z
      .string()
      .min(1, "CORS_ALLOWED_ORIGIN is required")
      .refine((corsAllowedOrigin) => corsAllowedOrigin !== "*", {
        message: "CORS_ALLOWED_ORIGIN '*' is not allowed"
      }),
    CORS_MAX_AGE: z.coerce.number().int().nonnegative().default(3600),
    GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required"),
    GITHUB_STORAGE_REPO_NAME: z.string().min(1, "GITHUB_STORAGE_REPO_NAME is required"),
    GITHUB_STORAGE_BRANCH: z.string().min(1, "GITHUB_STORAGE_BRANCH is required"),
    GITHUB_STORAGE_DIRECTORY_PATH: z.string().min(1, "GITHUB_STORAGE_DIRECTORY_PATH is required"),
    GITHUB_API_VERSION: z.string().min(1, "GITHUB_API_VERSION is required"),
    REDIS_URL: z.string().min(1, "REDIS_URL is required")
  })
  .readonly();

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(input: NodeJS.ProcessEnv): EnvConfig {
  const parsed = envSchema.safeParse(input);
  if (!parsed.success) {
    console.error("[env] Invalid environment configuration", parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
}
