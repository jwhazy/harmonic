import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

const stop: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing the current song & clear the queue."),

  async run(interaction: CommandInteraction) {
    try {
      const attempt = global.player.stop(interaction);

      if (!attempt && !interaction.replied) {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "Stopped playing the song.",
              description: "Stopped playing the song & cleared the queue.",
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

export default stop;
