import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import env from "../env";
export const resume = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resume the current media"),
	async execute(interaction) {
		try {
			interaction.client.player.unpause();

			return await interaction.editReply(
				`${env.SUCCESS_EMOJI} Resumed the current media`,
			);
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to resume the current media`,
			);
		}
	},
} satisfies Command;
