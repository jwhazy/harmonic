import { CacheType, Interaction, SlashCommandBuilder } from "discord.js";

// Will remove this at some point.
export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction<CacheType>) => Promise<void>;
};

export default Command;
