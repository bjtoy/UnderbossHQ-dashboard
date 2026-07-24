import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.resolve(__dirname, "../debug-71ac38.log");

export function debugLogPlugin() {
  return {
    name: "agent-debug-log",
    configureServer(server) {
      server.middlewares.use("/__agent_debug_log", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            fs.appendFileSync(LOG_PATH, `${body.trim()}\n`, "utf8");
            res.statusCode = 204;
          } catch {
            res.statusCode = 500;
          }
          res.end();
        });
      });
    },
  };
}
