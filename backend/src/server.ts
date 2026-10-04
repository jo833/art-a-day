import { app } from "./app.js";
import { config } from "./config.js";

/** Starts the HTTP API on the configured interface and port. */
app.listen(config.port, config.host ?? "0.0.0.0", () => {
  console.log(`Art API listening on ${config.host}.`);
});
