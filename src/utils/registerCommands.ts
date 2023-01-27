import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import pause from "../commands/pause";
import play from "../commands/play";
import queue from "../commands/queue";
import restart from "../commands/restart";
import resume from "../commands/resume";
import skip from "../commands/skip";
import stop from "../commands/stop";
import Command from "../types/Command";

// wut
const json: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

export default async function registerCommands() {
  global.commands = new Map<string, Command>();

  [play, pause, queue, resume, stop, skip, restart].forEach((command) => {
    json.push(command.data.toJSON());
    commands.set(command.data.name, command);
  });

  const rest = new REST({ version: "10" }).setToken(
    process.env.BOT_TOKEN as string
  );

  try {
    await rest.put(
      Routes.applicationGuildCommands(config.botId, config.guildId),
      { body: json }
    );
  } catch (error) {
    console.error(error);
  }
}
