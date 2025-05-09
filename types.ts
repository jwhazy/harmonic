import type {
	CommandInteraction,
	Collection,
	SlashCommandBuilder,
} from "discord.js";

export interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
	}
}
