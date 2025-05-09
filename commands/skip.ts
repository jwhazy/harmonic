import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const skip = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip the current media"),
	async execute(interaction) {
		try {
			interaction.client.player.stop();

			return await interaction.editReply("Skipped the current media");
		} catch (error) {
			console.error(error);
			return await interaction.editReply("Failed to skip the current media");
		}
	},
} satisfies Command;
