import Eris from "eris";
import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

export const queue: Command = {
  name: "queue",
  description: "List the queue",
  type: 1,
  async run(interaction) {
    const q: Eris.EmbedField[] = [];
    try {
      global.player.queue.forEach((song, index) => {
        q.push({
          name: `${index + 1}. ${song.title}`,
          value: song.url,
          inline: true,
        });
      });
      return await interaction.createMessage({
        embeds: [
          embedCreate({
            title: "Queue",
            description: "All songs in queue:",
            author: "🎶🎶🎶",
            thumbnail: interaction.member?.avatarURL,
            fields: q,
            color: 0x00ff00,
          }),
        ],
      });
    } catch (e) {
      error(e);
      interaction.createMessage({
        content: "There was an error getting the queue",
        flags: 64,
      });
    }
  },
};

export default queue;
