import { REST, Routes } from "discord.js";
import env from "../utils/env";
import commands from "@/commands";

export default async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(env.botToken);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(env.clientId), {
      body: commands.forEach((command) => command.data.toJSON()),
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
