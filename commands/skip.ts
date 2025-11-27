import { SlashCommandBuilder } from "discord.js";
import { queue } from "../queue";
import env from "../utils/env";
import type { Command } from "../utils/types";

export const skip = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip the current media"),
	async execute(interaction) {
		try {
			if (
				queue.length === 0 ||
				interaction.client.player.state.status === "idle"
			) {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} There is no media to skip`,
				);
			}

			interaction.client.player.stop();

			return await interaction.editReply(
				`${env.SUCCESS_EMOJI} Skipped the current media`,
			);
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to skip the current media`,
			);
		}
	},
} satisfies Command;
