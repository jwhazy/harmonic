import { Readable } from "node:stream";
import { createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { add, playNext, queue } from "../queue";
import env from "../env";
import { z, ZodError } from "zod";

export const play = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play media through Cobalt")
		.addStringOption((option) =>
			option
				.setName("url")
				.setDescription("The URL of the media to play")
				.setRequired(true),
		) as SlashCommandBuilder,

	async execute(interaction) {
		try {
			interaction.editReply(`${env.LOADING_EMOJI} Running checks`);

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

			const url = z.string().url().parse(interaction.options.get("url")?.value);

			interaction.editReply(`${env.LOADING_EMOJI} Processing your request`);

			const response = await interaction.client.cobalt.processUrl({
				url: url,
				audioFormat: "mp3",
				filenameStyle: "basic",
				downloadMode: "audio",
			});

			console.log("Processing URL:", url);

			if (!response) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} Error processing media: No response from service.`,
				});
			}

			if (response.status === "error") {
				// TODO: Edit this Copilot generated slop

				const errorMessage = response.error
					? `${env.FAIL_EMOJI} Cobalt couldn't complete this request. Error: ${
							response.error.code
						}${
							response.error.context?.service
								? ` (Service: ${response.error.context.service})`
								: ""
						}${
							response.error.context?.limit
								? ` (Limit: ${response.error.context.limit})`
								: ""
						}`
					: `${env.FAIL_EMOJI} Cobalt couldn't complete this request. Error: While processing media.`;

				console.error("Cobalt API Error:", {
					url,
					error: response.error,
					timestamp: new Date().toISOString(),
				});

				return interaction.editReply({
					content: errorMessage,
				});
			}

			if (!response.url) {
				console.error("Cobalt API Error: No URL in response", {
					url,
					response,
					timestamp: new Date().toISOString(),
				});

				return interaction.editReply({
					content: `${env.FAIL_EMOJI} Error processing media: No URL returned from service.`,
				});
			}

			// Pull the file from the URL
			console.log("Pulling file from URL:", response.url);
			interaction.editReply(`${env.LOADING_EMOJI} Requesting file`);

			const file = await fetch(response.url);

			interaction.editReply(`${env.LOADING_EMOJI} Pulling file from servers`);

			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const stream = Readable.from(buffer);
			interaction.editReply(`${env.LOADING_EMOJI} Streaming file`);

			const resource = createAudioResource(stream);

			// Ensure we have a voice connection
			if (
				!interaction.client.connection ||
				interaction.client.connection.state.status === "disconnected"
			) {
				interaction.editReply(`${env.LOADING_EMOJI} Joining voice channel`);
				interaction.client.connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				});

				interaction.client.connection.subscribe(interaction.client.player);
			}

			interaction.editReply(`${env.LOADING_EMOJI} Adding to queue`);

			const fileName = response.filename || "unknown - unknown";

			let title = fileName;
			let author = "unknown";

			// Hack to get data from file name
			const lastDashIndex = fileName.lastIndexOf(" - ");
			if (lastDashIndex !== -1) {
				title = fileName.substring(0, lastDashIndex).trim();
				author = fileName
					.substring(lastDashIndex + 3, fileName.lastIndexOf("."))
					.trim();
			}

			add(resource, url, member.id, title, author);

			if (queue.length === 1) {
				// Reset auto-disconnect timer when starting playback
				if (interaction.client.autoDisconnectTimeout) {
					clearTimeout(interaction.client.autoDisconnectTimeout);
					interaction.client.autoDisconnectTimeout = undefined;
				}
				playNext(interaction.client);

				return interaction.editReply(
					`${env.SUCCESS_EMOJI} Now playing: **${title}** by **${author}**`,
				);
			}

			return interaction.editReply(
				`${env.SUCCESS_EMOJI} Added to queue: **${title}** by **${author}**`,
			);
		} catch (error) {
			if (error instanceof ZodError) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must provide a URL to play.`,
				});
			}

			console.error(error);
			return interaction.editReply(
				`${env.FAIL_EMOJI} Failed to play the media`,
			);
		}
	},
} satisfies Command;
