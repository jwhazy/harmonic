import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const queue = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("View the current queue"),
	async execute(interaction) {
		await interaction.editReply("Queue");

		const queue = interaction.client.queue;
		if (queue.length === 0) {
			await interaction.editReply("The queue is empty.");
		} else {
			await interaction.editReply(`The queue is: ${queue.join(", ")}`);
		}
	},
} satisfies Command;
