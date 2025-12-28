import { loadEnvFile as _loadEnvFile } from "node:process";

const ENV_LOOKUP_PATHS = [".env.local", ".env.dev", ".env.test", ".env.prod", ".env"];

function loadEnvFile(): void {
  for (const file of ENV_LOOKUP_PATHS) {
    try {
      _loadEnvFile(file);
      console.info(`[env] Loaded environment file: ${file}`);
      return;
    } catch {
      console.warn(`[env] Failed to load ${file}. Trying next fallback...`);
    }
  }
  console.error(
    "[env] No environment file found. Application will not start without .env configuration."
  );
}

loadEnvFile();
