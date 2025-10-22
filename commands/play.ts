import { createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { add, playNext, queue } from "../queue";
import env from "../env";
import { z, ZodError } from "zod";
import {
	downloadAudio,
	createStreamFromFile,
	getSongInfo,
} from "../yt-dlp/api";
import path from "node:path";

export const play = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play media from a URL")
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

			interaction.editReply(`${env.LOADING_EMOJI} Fetching song information`);

			const audioDir = path.join(process.cwd(), "audios");

			const song = await getSongInfo(url);

			if (song.filePath) {
				interaction.editReply(
					`${env.LOADING_EMOJI} Found **${song.title}** by **${song.author}** in cache`,
				);
			} else {
				interaction.editReply(
					`${env.LOADING_EMOJI} Downloading **${song.title}** by **${song.author}**`,
				);

				song.filePath = await downloadAudio(song.videoId, url, audioDir);
			}

			console.log("Downloaded:", song);

			interaction.editReply(
				`${env.LOADING_EMOJI} Creating audio stream for **${song.title}**`,
			);

			const stream = createStreamFromFile(song.filePath);
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

			add(resource, url, member.id, song.title, song.author);

			if (queue.length === 1) {
				// Reset auto-disconnect timer when starting playback
				if (interaction.client.autoDisconnectTimeout) {
					clearTimeout(interaction.client.autoDisconnectTimeout);
					interaction.client.autoDisconnectTimeout = undefined;
				}
				playNext(interaction.client);

				return interaction.editReply(
					`${env.SUCCESS_EMOJI} Now playing: **${song.title}** by **${song.author}**`,
				);
			}

			return interaction.editReply(
				`${env.SUCCESS_EMOJI} Added to queue: **${song.title}** by **${song.author}**`,
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
