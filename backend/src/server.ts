import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, config.host ?? "0.0.0.0", () => {
  console.log(`Art API listening on ${config.host}.`);
});

