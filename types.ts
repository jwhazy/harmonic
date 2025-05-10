import type { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import type {
	CommandInteraction,
	Collection,
	SlashCommandBuilder,
} from "discord.js";
import type { Cobalt } from "./cobalt/api";

export interface Command {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (interaction: CommandInteraction) => Promise<unknown>;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		connection: VoiceConnection | undefined;
		player: AudioPlayer;
		cobalt: Cobalt;
	}
}
