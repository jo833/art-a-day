import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

loadEnv({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

/** Reads and validates an environment variable required by the backend. */
function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Runtime settings shared by the API server and Met Collection client. */
export const config = {
  host: process.env.BACKEND_HOST?.trim(),
  port: Number(required("BACKEND_PORT")),
  frontendOrigin: process.env.FRONTEND_ORIGIN?.trim(),
  metApiBaseUrl: "https://collectionapi.metmuseum.org/public/collection/v1",
  metApiBaseSearchUrl:
    "https://collectionapi.metmuseum.org/public/collection/v1.1",
  upstreamTimeoutMs: 8_000,
  maxCandidates: 40,
  backendOrigin: process.env.BACKEND_ORIGIN?.trim(),
};

// Fail fast if the configured listening port is outside the TCP port range.
if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65_535) {
  throw new Error("BACKEND_PORT must be a valid TCP port.");
}
