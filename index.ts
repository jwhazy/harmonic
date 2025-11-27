import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import commands from "./commands";
import { playNext, queue } from "./queue";
import env from "./utils/env";

console.log("Starting harmonic...");

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildExpressions,
		GatewayIntentBits.GuildMessageReactions,
	],
});

client.once(Events.ClientReady, async (client) => {
	// Map commands to client
	client.commands = new Collection(
		commands.map((command) => [command.data.name, command]),
	);

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

			// Disconnect after 5 minutes of inactivity
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

	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	// Do nothing unless we are a command
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		// This should rarely happen unless you have deleted commands without reregistering.
		console.error(`No command matching ${interaction.commandName} was found.`);

		await interaction.reply({
			content: `${env.FAIL_EMOJI} There was an error while executing this command!`,
		});

		return;
	}

	try {
		// Acknowledge interaction in UI and allow more time to process
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
