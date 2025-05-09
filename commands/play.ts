import type { CommandInteraction } from "discord.js";
import { Readable } from "node:stream";
import { createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { cobalt } from "..";
import { add, playNext, queue } from "../queue";
import type { CobaltResponse } from "../cobalt/types";

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

	async execute(interaction: CommandInteraction) {
		try {
			const user = interaction.member?.user;
			if (!user) {
				return interaction.reply({
					content: "You must be in a voice channel to use this command.",
					ephemeral: true,
				});
			}

			const guildUser = interaction.guild?.members.cache.get(user.id);
			if (!guildUser) {
				return interaction.reply({
					content: "You must be in a voice channel to use this command.",
					ephemeral: true,
				});
			}

			const channel = guildUser.voice.channel;
			if (!channel) {
				return interaction.reply({
					content: "You must be in a voice channel to use this command.",
					ephemeral: true,
				});
			}

			const data = interaction.options.get("url");

			if (!data) {
				return interaction.reply({
					content: "You must provide a URL to play.",
					ephemeral: true,
				});
			}

			const url = data.value as string;

			// God I hate doing this
			let response: CobaltResponse | undefined = undefined;

			try {
				response = await cobalt.processUrl({
					url: url,
					audioFormat: "mp3",
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
					content: "Error processing media: No response from service.",
				});
			}

			if (response.status === "error") {
				// TODO: Edit this Copilot generated slop

				const errorMessage = response.error
					? `Error processing media: ${response.error.code}${response.error.context?.service ? ` (Service: ${response.error.context.service})` : ""}${response.error.context?.limit ? ` (Limit: ${response.error.context.limit})` : ""}`
					: "Error processing media.";

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
					content: "Error processing media: No URL returned from service.",
				});
			}

			// Pull the file from the URL
			const file = await fetch(response.url);
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const stream = Readable.from(buffer);
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

			add(resource, url);

			if (queue.length === 0) {
				playNext(interaction.client);

				await interaction.editReply({
					content: `Now playing: ${url}`,
				});
			} else {
				await interaction.editReply({
					content: `Added to queue: ${url}`,
				});
			}
		} catch (error) {
			console.error(error);
			return await interaction.editReply("Failed to play the media");
		}
	},
} satisfies Command;
