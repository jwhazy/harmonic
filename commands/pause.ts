import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const pause = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the current media"),
	async execute(interaction) {
		interaction.client.player.pause();

		await interaction.editReply("Paused the current media");
	},
} satisfies Command;
