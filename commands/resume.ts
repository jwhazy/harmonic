import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const resume = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resume the current media"),
	async execute(interaction) {
		try {
			interaction.client.player.unpause();

			return await interaction.editReply("Resumed the current media");
		} catch (error) {
			console.error(error);
			return await interaction.editReply("Failed to resume the current media");
		}
	},
} satisfies Command;
