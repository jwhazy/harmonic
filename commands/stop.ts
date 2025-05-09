import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const stop = {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Clears the queue and stops the current media"),
	async execute(interaction) {
		try {
			interaction.client.player.stop();
			interaction.client.player.removeAllListeners();

			interaction.client.queue = [];

			if (interaction.client.connection) {
				interaction.client.connection.destroy();
				interaction.client.connection = undefined;
			}
		} catch (error) {
			console.error(error);
			return await interaction.editReply("Failed to stop the current media");
		}

		return await interaction.editReply("Stopped the current media");
	},
} satisfies Command;
