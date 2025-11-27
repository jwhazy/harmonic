import { SlashCommandBuilder } from "discord.js";
import { clear } from "../queue";
import env from "../utils/env";
import type { Command } from "../utils/types";

export const stop = {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Clears the queue and stops the current media"),
	async execute(interaction) {
		try {
			interaction.client.player.stop();
			clear();

			if (interaction.client.connection) {
				interaction.client.connection.destroy();
				interaction.client.connection = undefined;
				if (interaction.client.autoDisconnectTimeout) {
					clearTimeout(interaction.client.autoDisconnectTimeout);
					interaction.client.autoDisconnectTimeout = undefined;
				}
			}
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to stop the current media`,
			);
		}

		return await interaction.editReply(
			`${env.SUCCESS_EMOJI} Stopped the current media`,
		);
	},
} satisfies Command;
