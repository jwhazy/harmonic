import dotenv from "dotenv";
import { Client } from "discord.js";
import registerCommands from "./utils/registerCommands";
import registerInteractions from "./handlers/interactionCreate";
import { log, success } from "./utils/logger";
import env from "@/utils/env";
log("Starting...");

dotenv.config();

export const client = new Client({
  // change later
  intents: [
    1, 2, 4, 8, 16, 32, 64, 128, 256, 1024, 2048, 4096, 8192, 16384, 32768,
    65536, 1048576, 2097152,
  ],
});

client.once("ready", () => {
  registerInteractions();

  env.guildCommands && registerCommands();

  env.status &&
    client.user?.setPresence({
      status: "online",
      activities: [{ name: env.status, type: 0 }],
    });

  success(
    `${env.name} logged in as ${client.user?.username}#${client.user?.discriminator}`
  );
});

client.login(process.env.BOT_TOKEN);
