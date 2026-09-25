import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

loadEnv({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  host: process.env.BACKEND_HOST?.trim(),
  port: Number(required("BACKEND_PORT")),
  frontendOrigin: process.env.FRONTEND_ORIGIN?.trim(),
  metApiBaseUrl: "https://collectionapi.metmuseum.org/public/collection/v1",
  upstreamTimeoutMs: 8_000,
  maxCandidates: 20,
  backendOrigin: process.env.BACKEND_ORIGIN?.trim(),
};

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65_535) {
  throw new Error("BACKEND_PORT must be a valid TCP port.");
}
