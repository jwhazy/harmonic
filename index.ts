import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { Client, Collection, Events } from "discord.js";
import commands from "./commands";
import { playNext, queue } from "./queue";
import env from "./utils/env";

export const client = new Client({
	intents: [
		1, 2, 4, 4, 8, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
		32768, 65536, 1048576, 2097152, 16777216, 33554432,
	],
});

client.once(Events.ClientReady, async (client) => {
	console.log(`Ready! Logged in as ${client.user.tag}`);

	client.commands = new Collection(
		commands.map((command) => [command.data.name, command]),
	);

	client.connection = undefined;
	client.player = new AudioPlayer();

	client.player.on(AudioPlayerStatus.Idle, () => {
		queue.shift();

		const nextUrl = playNext(client);

		if (nextUrl) {
			console.log(`Now playing: ${nextUrl}`);
			if (client.autoDisconnectTimeout) {
				clearTimeout(client.autoDisconnectTimeout);
				client.autoDisconnectTimeout = undefined;
			}
		} else {
			if (client.autoDisconnectTimeout) {
				clearTimeout(client.autoDisconnectTimeout);
			}
			client.autoDisconnectTimeout = setTimeout(
				() => {
					if (client.connection) {
						client.connection.destroy();
						client.connection = undefined;
						console.log("Disconnected due to inactivity.");
					}
					client.autoDisconnectTimeout = undefined;
				},
				5 * 60 * 1000,
			);
		}
	});

	client.user.setPresence({
		activities: [
			{ name: env.ACTIVITY ?? `Use @${client.user.username}`, type: 0 },
		],
		status: "online",
	});
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		await interaction.reply({
			content: `${env.FAIL_EMOJI} There was an error while executing this command!`,
		});
		return;
	}

	try {
		await interaction.deferReply();

		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: `${env.FAIL_EMOJI} There was an error while executing this command!`,
				});
			} else {
				await interaction.editReply({
					content: `${env.FAIL_EMOJI} There was an error while executing this command!`,
				});
			}
		} catch (replyError) {
			console.error("Failed to send error message:", replyError);
		}
	}
});

client.login(env.TOKEN);
