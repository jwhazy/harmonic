import type { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import type {
	Collection,
	SlashCommandBuilder,
} from "discord.js";

export interface Command {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (interaction: any) => Promise<unknown>;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		connection: VoiceConnection | undefined;
		player: AudioPlayer;
		autoDisconnectTimeout?: NodeJS.Timeout;
	}
}
