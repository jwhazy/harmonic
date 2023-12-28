import { SlashCommandBuilder } from "discord.js";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import player from "@/audio/player";

const skip: Command = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the playing current song."),

  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const attempt = player.skip(interaction);

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
  },
};

export default skip;
