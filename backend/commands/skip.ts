import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

const skip: Command = {
  data: new SlashCommandBuilder()
    .setName("Skip")
    .setDescription("Skip the playing current song."),

  async run(interaction: CommandInteraction) {
    try {
      const attempt = global.player.skip(interaction);

      if (!attempt && !interaction.replied) {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "Successfully skipped.",
              description: "Skipped the playing the song.",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              color: 0x00ff00,
            }),
          ],
        });
      }
    } catch (e) {
      error(e);
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "There was an error stopping the song",
            description: "Make sure you are in a voice channel.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x880808,
          }),
        ],
      });
    }
  },
};

export default skip;
