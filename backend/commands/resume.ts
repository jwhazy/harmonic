import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

const resume: Command = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume playing the current song."),

  async run(interaction: CommandInteraction) {
    try {
      if (!global.player.resume(interaction)) {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "Song resumed",
              description: "Type /pause at anytime to pause.",
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
            title: "There was an error pausing the song",
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

export default resume;
