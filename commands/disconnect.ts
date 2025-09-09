import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import env from "../env";

export const disconnect = {
	data: new SlashCommandBuilder()
		.setName("disconnect")
		.setDescription("Disconnect from the current voice channel"),
	async execute(interaction) {
		try {
			if (!interaction.client.connection?.state.status) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} I am not connected to any voice channel.`,
				});
			}

			interaction.client.connection.destroy();
			interaction.client.connection = undefined;
			if (interaction.client.autoDisconnectTimeout) {
				clearTimeout(interaction.client.autoDisconnectTimeout);
				interaction.client.autoDisconnectTimeout = undefined;
			}

			return interaction.editReply(
				`${env.SUCCESS_EMOJI} Disconnected from the voice channel`,
			);
		} catch (error) {
			console.error(error);
			return interaction.editReply(
				`${env.FAIL_EMOJI} Failed to disconnect from the voice channel`,
			);
		}
	},
} satisfies Command;
