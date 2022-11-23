import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";
import { error } from "../utils/logger";

export const play: Command = {
  name: "play",
  description: "Play song (or add to queue)",
  type: 1,
  options: [
    {
      name: "url",
      description: "Name or URL of media",
      type: 3,
      required: false,
    },
  ],

  async run(interaction) {
    try {
      global.player.play(interaction);
    } catch (e) {
      error(e);
      return interaction.createMessage({
        embeds: [
          embedCreate({
            title: "There was an error playing your song",
            description: "Make sure you are in a voice channel and try again.",
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

export default play;
