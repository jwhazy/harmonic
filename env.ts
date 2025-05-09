import { env } from "bun";

if (!env.BOT_TOKEN) {
	throw new Error("DISCORD_TOKEN is not set");
}

if (!env.CLIENT_ID) {
	throw new Error("CLIENT_ID is not set");
}

if (!env.GUILD_ID) {
	throw new Error("GUILD_ID is not set");
}

export default {
	TOKEN: env.BOT_TOKEN,
	CLIENT_ID: env.CLIENT_ID,
	GUILD_ID: env.GUILD_ID,
};
