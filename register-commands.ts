import { REST, Routes } from "discord.js";
import env from "./env";
import commands from "./commands";

const rest = new REST().setToken(env.TOKEN);

const commandData = commands.map((command) => command.data);

try {
	console.log(
		`Started refreshing ${commands.length} application (/) commands.`,
	);

	await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
		body: commandData,
	});

	console.log("Successfully reloaded application (/) commands.");
} catch (error) {
	if (error instanceof Error) {
		console.error(`Error reloading commands: ${error.message}`);
	} else {
		console.error("An unknown error occurred.");
	}
}
