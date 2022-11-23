import Eris from "eris";
import { error } from "./logger";
import Player from "./player";

export default function setGlobals() {
  const {
    GUILD_ID,
    BOT_TOKEN,
    NAME,
    BOT_ID,
    STATUS,
    GUILD_COMMANDS,
    DASHBOARD,
  } = process.env;

  if (!BOT_ID || !GUILD_ID || !BOT_TOKEN) {
    error("Missing enviroment variables.");
    process.exit(1);
  }

  global.client = Eris(BOT_TOKEN as string);
  global.player = new Player();

  global.config = {
    guildId: GUILD_ID,
    botId: BOT_ID,
    name: NAME || "Harmonic",
    status: STATUS || "Get started with /play.",
    dashboard: Boolean(DASHBOARD) || false,
    guildCommands: Boolean(GUILD_COMMANDS),
  };
}
