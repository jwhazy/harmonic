import { env } from "bun";

import { z } from "zod";

const envSchema = z.object({
	TOKEN: z.string(),
	CLIENT_ID: z.string(),
	GUILD_ID: z.string(),
	COBALT_URL: z.string(),
	COBALT_KEY: z.string().optional(),
	ACTIVITY: z.string().optional(),
	SUCCESS_EMOJI: z.string().optional().default("✅"),
	FAIL_EMOJI: z.string().optional().default("❌"),
	LOADING_EMOJI: z.string().optional().default("⏳"),
});

const validatedEnv = envSchema.parse({
	TOKEN: env.BOT_TOKEN,
	CLIENT_ID: env.CLIENT_ID,
	GUILD_ID: env.GUILD_ID,
	COBALT_URL: env.COBALT_URL,
	COBALT_KEY: env.COBALT_KEY,
	ACTIVITY: env.ACTIVITY,
	SUCCESS_EMOJI: env.SUCCESS_EMOJI,
	FAIL_EMOJI: env.FAIL_EMOJI,
	LOADING_EMOJI: env.LOADING_EMOJI,
});

export default validatedEnv;
