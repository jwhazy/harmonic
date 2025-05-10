import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import env from "../env";
import { queue } from "../queue";

export const pause = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the current media"),
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

			if (interaction.client.player.state.status === "paused") {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} The current media is already paused`,
				);
			}

			if (interaction.client.player.state.status !== "playing") {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} The current media is not playing`,
				);
			}

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
