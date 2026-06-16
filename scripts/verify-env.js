import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const required = ["VITE_API_URL"];
const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("Dashboard environment validation failed.");
  for (const key of missing) {
    console.error(`  Missing: ${key}`);
  }
  process.exit(1);
}

console.log("Dashboard environment OK");
console.log(`  VITE_API_URL=${process.env.VITE_API_URL}`);
