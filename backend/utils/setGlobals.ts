import Player from "./player";

export default function setGlobals() {
  const { GUILD_ID, BOT_TOKEN, NAME, BOT_ID, STATUS, GUILD_COMMANDS } =
    process.env;

  if (!BOT_ID || !GUILD_ID || !BOT_TOKEN) {
    console.error("Missing enviroment variables.");
    process.exit(1);
  }

  global.player = new Player();

  global.config = {
    guildId: GUILD_ID,
    botId: BOT_ID,
    name: NAME || "Harmonic",
    status: STATUS || "Get started with /play.",
    guildCommands: GUILD_COMMANDS === "true",
  };
}
