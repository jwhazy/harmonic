import { SlashCommandBuilder } from "discord.js";
import Command from "@/types/Command";
import player from "@/audio/player";

const play = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or resume one!")
    .addStringOption((option) =>
      option.setName("title").setDescription("The title or URL of the song.")
    ),

  async execute(interaction) {
    if (!interaction.isCommand()) return;
    player.play(interaction);
  },
} as Command;

export default play;
