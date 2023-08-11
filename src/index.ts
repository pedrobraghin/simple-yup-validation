import "dotenv/config";
import "./templates";
import { app } from "./app";
import { Server } from "http";
import { database } from "./database";
import { Logger } from "./providers/logger";

const port = String(process.env.PORT);

let server: Server | undefined;

async function main() {
  server = app.listen(port, () => {
    Logger.info("Server is running on port " + port);
  });
}

main().catch(async () => {
  await database.$disconnect();
  Logger.error("Server crashed: " + new Date().toISOString());
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("SIGALRM", () => {
  if (server) {
    server.close();
  }
  database.$disconnect();
});
