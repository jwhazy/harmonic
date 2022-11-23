import Eris from "eris";
import dotenv from "dotenv";
import registerCommands from "./registerCommands";
import registerInteractions from "./listeners/interaction";
import Player from "./player";
import { error, log, success } from "./utils/logger";
import startServer from "./api";

dotenv.config();

const { GUILD_ID, BOT_TOKEN, NAME, BOT_ID, STATUS, GUILD_COMMANDS, DASHBOARD } =
  process.env;

global.client = Eris(BOT_TOKEN as string);
global.player = new Player();

log("Starting...");

DASHBOARD && startServer();

if (!BOT_ID || !GUILD_ID || !NAME || !BOT_TOKEN) {
  error("Missing enviroment variables.");
  process.exit(1);
} else {
  global.config = {
    guildId: GUILD_ID,
    botId: BOT_ID,
    name: NAME,
    status: STATUS,
  };
}

client.on("ready", () => {
  registerInteractions();

  GUILD_COMMANDS && registerCommands();

  global.config.status &&
    client.editStatus("dnd", { type: 3, name: global.config.status });

  success(
    `${config.name} logged in as ${client.user?.username}#${client.user?.discriminator}`
  );
});

client.connect();
