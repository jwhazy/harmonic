import {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";
import Player from "../utils/player";

const restart: Command = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the music bot"),
  async run(interaction: CommandInteraction) {
    try {
      // check if user has Administrator permission
      if (
        (interaction.member?.permissions as PermissionsBitField).has(
          "Administrator"
        )
      ) {
        global.player.stop(interaction);
        global.player = new Player();
      } else {
        // if user doesn't have permission, send error message
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "You do not have permission to run this command.",
              description: "Reason: No administrative permissions.",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              color: 0x880808,
            }),
          ],
        });
      }
    } catch (e) {
      error(e);
    }
  },
};

export default restart;
