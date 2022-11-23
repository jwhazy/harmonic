import pause from "./commands/pause";
import play from "./commands/play";
import queue from "./commands/queue";
import resume from "./commands/resume";
import skip from "./commands/skip";
import test from "./commands/test";
import { log } from "./utils/logger";

export default async function registerCommands() {
  global.commands = [play, pause, resume, skip, queue, test];

  if (config.guildId) {
    log("Registering guild commands");

    commands.forEach(async (command) => {
      try {
        await client.createGuildCommand(config.guildId, command);
        log(`Registered command: ${command.name}`);
      } catch (err) {
        console.error(err);
      }
    });
  }
}
