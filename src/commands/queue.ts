import { SlashCommandBuilder, APIEmbedField } from "discord.js";
import Command from "../types/Command";
import Song from "../types/Song";
import embedCreate from "../utils/embedCreate";
import handleError from "../utils/handleError";
import player from "@/audio/player";

const queue: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get the current queue."),

  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const q: APIEmbedField[] = [];
    try {
      player.queue.forEach((song: Song, index: number) => {
        q.push({
          name: `${(index + 1).toString()}. ${song.title || "unknown"}`,
          value: song.url,
          inline: true,
        });
      });

      if (q.length >= 1) {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "Queue",
              description: "All songs in queue:",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              fields: q,
              color: 0x00ff00,
            }),
          ],
        });
      } else {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "There was an error fetching the queue.",
              description: "Reason: No songs in queue.",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              color: 0x880808,
            }),
          ],
        });
      }

      return;
    } catch (e) {
      handleError(
        interaction,
        e,
        "There was an error fetching the queue.",
        "Please try again later."
      );
    }
  },
};

export default queue;
