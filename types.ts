import type { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import type {
	CommandInteraction,
	Collection,
	SlashCommandBuilder,
} from "discord.js";

export interface Command {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (interaction: CommandInteraction) => Promise<unknown>;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		queue: string[];
		connection: VoiceConnection | undefined;
		player: AudioPlayer;
	}
}
