import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";

const pause: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song."),

  async run(interaction: CommandInteraction) {
    if (!global.player.pause(interaction)) {
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "Song paused",
            description: "Type /resume at anytime to resume.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x00ff00,
          }),
        ],
      });
    }
  },
};

export default pause;
