import { env } from "bun";
import { z } from "zod";

/**
 * **Environment variables schema validation**
 *
 * To use these variables assign them (with the same name) in .env with the usual syntax
 * They will autopopulate with the correct type and will throw errors if something is missing.
 *
 * For emojis they must be in format:
 *
 * <a:loading:EMOJI_ID_HERE> for animated emojis
 *
 * <:success:EMOJI_ID_HERE> for static emojis
 *
 * You configure the emojis in the bot settings on the developer portal.
 * You can NOT use emojis from servers.
 */
const envSchema = z.object({
	TOKEN: z.string(),
	CLIENT_ID: z.string(),
	GUILD_ID: z.string(),
	ACTIVITY: z.string().optional(),
	SUCCESS_EMOJI: z.string().optional().default("✅"),
	FAIL_EMOJI: z.string().optional().default("❌"),
	LOADING_EMOJI: z.string().optional().default("⏳"),
});

const validatedEnv = envSchema.parse({
	TOKEN: env.BOT_TOKEN,
	CLIENT_ID: env.CLIENT_ID,
	GUILD_ID: env.GUILD_ID,
	ACTIVITY: env.ACTIVITY,
	SUCCESS_EMOJI: env.SUCCESS_EMOJI,
	FAIL_EMOJI: env.FAIL_EMOJI,
	LOADING_EMOJI: env.LOADING_EMOJI,
});

export default validatedEnv;
