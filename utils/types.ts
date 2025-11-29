import type {
	AudioPlayer,
	AudioResource,
	VoiceConnection,
} from "@discordjs/voice";
import type {
	ChatInputCommandInteraction,
	Collection,
	SlashCommandBuilder,
} from "discord.js";

export type Command = {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
};

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		connection?: VoiceConnection;
		player: AudioPlayer;
		autoDisconnectTimeout?: NodeJS.Timeout;
	}
}

export type QueueItem = {
	resource: AudioResource;
	url: string;
	requestedBy: string;
	title: string;
	author: string;
};
