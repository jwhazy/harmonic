import dotenv from "dotenv";
import registerCommands from "./utils/registerCommands";
import registerInteractions from "./listeners/interaction";
import { log, success } from "./utils/logger";
import setGlobals from "./utils/setGlobals";
import startServer from "./server/api";

dotenv.config();

log("Starting...");

setGlobals();

global.client.on("ready", () => {
  registerInteractions();

  global.config.guildCommands && registerCommands();

  global.config.dashboard && startServer();

  global.config.status &&
    client.editStatus("dnd", {
      type: 3,
      name: global.config.status || "Get started with /play.",
    });

  success(
    `${config.name} logged in as ${client.user?.username}#${client.user?.discriminator}`
  );
});

client.connect();
