import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { queue as globalQueue } from "../queue";
import env from "../env";

export const queue = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("View the current queue"),
	async execute(interaction) {
		function format(item: (typeof globalQueue)[number], index: number) {
			if (index === 0) return "";

			return `${index}: **${item.title}** - <@${item.requestedBy}>`;
		}

		try {
			if (globalQueue.length <= 1) {
				return await interaction.editReply(
					`${env.FAIL_EMOJI} The queue is empty.`,
				);
			}

			const queueItems = globalQueue.map((item, index) => format(item, index));

			return await interaction.editReply({
				content: `${env.SUCCESS_EMOJI} **Coming up:**${queueItems.join("\n")}`,
				allowedMentions: { repliedUser: false },
			});
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to view the queue`,
			);
		}
	},
} satisfies Command;
