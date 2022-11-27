import { CommandInteraction, SlashCommandBuilder } from "discord.js";

type Command = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  run: (interaction: CommandInteraction) => Promise<void>;
};

export default Command;
