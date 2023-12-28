import { config } from "dotenv";
config();

const {
  GUILD_ID,
  BOT_TOKEN,
  NAME,
  BOT_ID,
  STATUS,
  GUILD_COMMANDS,
  COOKIES,
  DJ_ROLE,
} = process.env;

if (!BOT_ID || !GUILD_ID || !BOT_TOKEN) {
  throw new Error("Missing enviroment variables.");
}

export default {
  guildId: GUILD_ID,
  clientId: BOT_ID,
  name: NAME || "Harmonic",
  status: STATUS || "Get started with /play.",
  guildCommands: GUILD_COMMANDS === "true",
  cookies: COOKIES as string,
  djRole: DJ_ROLE || "DJ",
  botToken: BOT_TOKEN,
};
