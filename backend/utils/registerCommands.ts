import pause from "../commands/pause";
import play from "../commands/play";
import queue from "../commands/queue";
import resume from "../commands/resume";
import skip from "../commands/skip";
import { error, log } from "./logger";

export default async function registerCommands() {
  global.commands = [play, pause, resume, skip, queue];

  if (config.guildId) {
    log("Registering guild commands, this can take awhile...");

    commands.forEach(async (command) => {
      try {
        await client.createGuildCommand(config.guildId, command);
        log(`Registered command: ${command.name}`);
      } catch (e) {
        error(e);
      }
    });
  }
}
