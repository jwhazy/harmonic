import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("Pong!");
	},
} satisfies Command;
