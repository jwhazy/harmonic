import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

export const resume: Command = {
  name: "resume",
  description: "Resume the current song (if paused)",
  type: 1,
  async run(interaction) {
    try {
      if (global.player.resume()) {
        interaction.createMessage({
          embeds: [
            embedCreate({
              title: player.queue[0].title,
              description: "Resumed",
              author: "🎶🎶🎶",
              image: player.queue[0].avatar,
              thumbnail: player.queue[0].avatar,

              color: 0x00ff00,
              url: player.queue[0].url,
            }),
          ],
          flags: 64,
        });
      } else {
        interaction.createMessage({
          embeds: [
            embedCreate({
              title: "There was an error resuming the song",
              description: "Make sure you are in a voice channel.",
              author: "🎶🎶🎶",
              thumbnail: interaction.member?.avatarURL,
              color: 0x880808,
            }),
          ],
          flags: 64,
        });
      }
    } catch (e) {
      error(e);
      interaction.createMessage({
        embeds: [
          embedCreate({
            title: "There was an error resuming the song",
            description: "Make sure you are in a voice channel.",
            author: "🎶🎶🎶",
            thumbnail: interaction.member?.avatarURL,
            color: 0x880808,
          }),
        ],
        flags: 64,
      });
    }
  },
};

export default resume;
