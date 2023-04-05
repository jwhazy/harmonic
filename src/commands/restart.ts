import {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import handleError from "../utils/handleError";
import Player from "../utils/player";

const restart: Command = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the music bot"),
  async run(interaction: CommandInteraction) {
    try {
      if (
        (interaction.member?.permissions as PermissionsBitField).has(
          "Administrator"
        ) ||
        interaction.guild?.roles.cache.find((r) => r.name === config.djRole)
      ) {
        global.player.stop(interaction);
        global.player = new Player();

        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "Restarted.",
              description: "Restarted successfully.",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              color: 0x00ff00,
            }),
          ],
        });
      } else {
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
      handleError(
        interaction,
        e,
        "There was an error restarting the bot!",
        (e as Error).message
      );
    }
  },
};

export default restart;
