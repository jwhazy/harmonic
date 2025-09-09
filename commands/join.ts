import { SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import type { Command } from "../types";
import env from "../env";

export const join = {
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join your current voice channel"),
	async execute(interaction) {
		try {
			const member = interaction.member;
			if (!member || !("voice" in member)) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must be in a voice channel to use this command.`,
				});
			}

			const channel = member.voice.channel;
			if (!channel) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must be in a voice channel to use this command.`,
				});
			}

			if (interaction.client.connection?.state.status === "ready") {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} I am already connected to a voice channel.`,
				});
			}

			interaction.client.connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			interaction.client.connection.subscribe(interaction.client.player);

			return interaction.editReply(
				`${env.SUCCESS_EMOJI} Joined your voice channel`,
			);
		} catch (error) {
			console.error(error);
			return interaction.editReply(
				`${env.FAIL_EMOJI} Failed to join the voice channel`,
			);
		}
	},
} satisfies Command;
