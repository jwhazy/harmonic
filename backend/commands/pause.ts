import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

export const pause: Command = {
  name: "pause",
  description: "Pause the current song (if playing)",
  type: 1,
  async run(interaction) {
    try {
      if (global.player.pause()) {
        interaction.createMessage({
          embeds: [
            embedCreate({
              title: player.queue[0].title,
              description: "Skipped song.",
              author: "🎶🎶🎶",
              image: player.queue[0].avatar,
              thumbnail: player.queue[0].thumbnail,

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
              title: "Song paused",
              description: "Type /resume at anytime to resume.",
              author: "🎶🎶🎶",
              thumbnail: interaction.member?.avatarURL,
              color: 0x00ff00,
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
            title: "There was an error pausing the song",
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

export default pause;
