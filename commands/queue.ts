import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const queue = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("View the current queue"),
	async execute(interaction) {
		try {
			const queue = interaction.client.queue;

			if (queue.length === 0) {
				return await interaction.editReply("The queue is empty.");
			}

			return await interaction.editReply(`The queue is: ${queue.join(", ")}`);
		} catch (error) {
			console.error(error);
			return await interaction.editReply("Failed to view the queue");
		}
	},
} satisfies Command;
