import type {
	AudioPlayer,
	AudioResource,
	VoiceConnection,
} from "@discordjs/voice";
import type { Collection, SlashCommandBuilder } from "discord.js";

export type Command = {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	// biome-ignore lint/suspicious/noExplicitAny: TODO: fix type later
	execute: (interaction: any) => Promise<unknown>;
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
