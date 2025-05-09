import { Client, Events, MessageFlags, Collection } from "discord.js";
import env from "./env";
import commands from "./commands";
import { Cobalt } from "./cobalt/api";
import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { playNext, queue } from "./queue";

export const cobalt = new Cobalt(env.COBALT_URL, env.COBALT_KEY);

export const client = new Client({
	intents: [
		1, 2, 4, 8, 16, 32, 64, 128, 256, 1024, 2048, 4096, 8192, 16384, 32768,
		65536, 1048576, 2097152,
	],
});

client.once(Events.ClientReady, (client) => {
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
		}
	});
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});

		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					flags: MessageFlags.Ephemeral,
				});
			}
		} catch (replyError) {
			console.error("Failed to send error message:", replyError);
		}
	}
});

client.login(env.TOKEN);
