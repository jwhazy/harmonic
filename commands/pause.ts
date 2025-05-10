import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import env from "../env";

export const pause = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the current media"),
	async execute(interaction) {
		try {
			interaction.client.player.pause();

			return await interaction.editReply(
				`${env.SUCCESS_EMOJI} Paused the current media`,
			);
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to pause the current media`,
			);
		}
	},
} satisfies Command;
