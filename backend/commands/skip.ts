import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";

export const skip: Command = {
  name: "skip",
  description: "Skip the current song",
  type: 1,
  async run(interaction) {
    try {
      if (global.player.skip()) {
        interaction.createMessage({
          content: "Skipped the current song",
          flags: 64,
        });
      } else {
        interaction.createMessage({
          embeds: [
            embedCreate({
              title: "There is no song playing",
              description: "",
              author: "🎶🎶🎶",
              thumbnail: interaction.member?.avatarURL,
              color: 0x880808,
            }),
          ],
          flags: 64,
        });
      }
    } catch (error) {
      console.log(error);
      interaction.createMessage({
        embeds: [
          embedCreate({
            title: "There was an error skipping the song",
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

export default skip;
