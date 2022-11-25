import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import Command from "../types/Command";
import { error } from "../utils/logger";

const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or resume one!")
    .addStringOption((option) =>
      option.setName("title").setDescription("The title or URL of the song.")
    ),

  async run(interaction: CommandInteraction) {
    try {
      global.player.play(interaction);
    } catch (e) {
      error(e);
    }
  },
};

export default play;
