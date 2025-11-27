import { SlashCommandBuilder } from "discord.js";
import { queue } from "../queue";
import env from "../utils/env";
import type { Command } from "../utils/types";

export const resume = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resume the current media"),
	async execute(interaction) {
		try {
			if (
				interaction.client.player.state.status === "idle" ||
				queue.length === 0
			) {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} There is no media playing`,
				);
			}

			if (interaction.client.player.state.status === "playing") {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} The current media is already playing`,
				);
			}

			if (interaction.client.player.state.status !== "paused") {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} The current media is not paused`,
				);
			}

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
