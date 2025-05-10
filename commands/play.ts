import { Readable } from "node:stream";
import { createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { add, playNext, queue } from "../queue";
import type { CobaltResponse } from "../cobalt/types";
import env from "../env";

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
			const user = interaction.member?.user;
			if (!user) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must be in a voice channel to use this command.`,
				});
			}

			const guildUser = interaction.guild?.members.cache.get(user.id);
			if (!guildUser) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must be in a voice channel to use this command.`,
				});
			}

			const channel = guildUser.voice.channel;
			if (!channel) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must be in a voice channel to use this command.`,
				});
			}

			interaction.editReply(`${env.LOADING_EMOJI} Getting ready`);

			const data = interaction.options.get("url");

			if (!data) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} You must provide a URL to play.`,
				});
			}

			const url = data.value as string;

			// God I hate doing this
			let response: CobaltResponse | undefined = undefined;

			try {
				console.log("Processing URL:", url);
				interaction.editReply(
					`${env.LOADING_EMOJI} Processing your request with Cobalt`,
				);
				response = await interaction.client.cobalt.processUrl({
					url: url,
					audioFormat: "mp3",
					filenameStyle: "basic",
					downloadMode: "audio",
				});
			} catch (error) {
				console.error("Failed to process URL with Cobalt:", {
					url,
					error,
					timestamp: new Date().toISOString(),
				});
			}

			if (!response) {
				return interaction.editReply({
					content: `${env.FAIL_EMOJI} Error processing media: No response from service.`,
				});
			}

			if (response.status === "error") {
				// TODO: Edit this Copilot generated slop

				const errorMessage = response.error
					? `${env.FAIL_EMOJI} Cobalt couldn't complete this request. Error: ${response.error.code}${response.error.context?.service ? ` (Service: ${response.error.context.service})` : ""}${response.error.context?.limit ? ` (Limit: ${response.error.context.limit})` : ""}`
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
			interaction.editReply(`${env.LOADING_EMOJI} Pulling file from servers`);

			const file = await fetch(response.url);
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			interaction.editReply(`${env.LOADING_EMOJI} Converting file to buffer`);

			const stream = Readable.from(buffer);
			interaction.editReply(`${env.LOADING_EMOJI} Streaming file`);

			const resource = createAudioResource(stream);

			// Ensure we have a voice connection
			if (!interaction.client.connection) {
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

			const lastDashIndex = fileName.lastIndexOf(" - ");
			if (lastDashIndex !== -1) {
				title = fileName.substring(0, lastDashIndex).trim();
				author = fileName
					.substring(lastDashIndex + 3, fileName.lastIndexOf("."))
					.trim();
			}

			add(resource, url, user.id, title, author);

			if (queue.length === 1) {
				playNext(interaction.client);

				await interaction.editReply(
					`${env.SUCCESS_EMOJI} Now playing: **${title}** by **${author}**`,
				);
			} else {
				await interaction.editReply(
					`${env.SUCCESS_EMOJI} Added to queue: **${title}** by **${author}**`,
				);
			}
		} catch (error) {
			console.error(error);
			return await interaction.editReply(
				`${env.FAIL_EMOJI} Failed to play the media`,
			);
		}
	},
} satisfies Command;
