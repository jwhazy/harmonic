import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { queue } from "../queue";
import env from "../env";

export const nowPlaying = {
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Show information about the currently playing track"),
	async execute(interaction) {
		try {
			if (queue.length === 0) {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} There is no track currently playing`,
				);
			}

			const currentTrack = queue[0];
			const status = interaction.client.player.state.status;

			return await interaction.editReply({
				content: `${env.SUCCESS_EMOJI} ${status === "playing" ? "Now playing" : "Paused"}: **${currentTrack.title}** by **${currentTrack.author}** - <@${currentTrack.requestedBy}>`,
				allowedMentions: { repliedUser: false },
			});
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to get now playing information`,
			);
		}
	},
} satisfies Command;
