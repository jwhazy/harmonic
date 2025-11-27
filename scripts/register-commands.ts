import { REST, Routes } from "discord.js";
import { commandData } from "../commands";
import env from "../utils/env";

const rest = new REST().setToken(env.TOKEN);

try {
	console.log(
		`Started refreshing ${commandData.length} application (/) commands.`,
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
