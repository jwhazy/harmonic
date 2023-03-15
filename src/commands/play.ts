import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import Command from "../types/Command";

const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or resume one!")
    .addStringOption((option) =>
      option.setName("title").setDescription("The title or URL of the song.")
    ),

  async run(interaction: CommandInteraction) {
    global.player.play(interaction);
  },
};

export default play;
