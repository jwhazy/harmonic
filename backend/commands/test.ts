import Command from "../types/Command";
import embedCreate from "../utils/embedCreate";

export const test: Command = {
  name: "test",
  description: "Test",
  type: 1,
  async run(interaction) {
    interaction.createMessage({
      embeds: [
        embedCreate({
          title: "jack",
          description: "jacksta",
          author: "jackstadev",
          image:
            "https://pbs.twimg.com/profile_banners/809567214261051392/1664025224/1500x500",
          thumbnail:
            "https://pbs.twimg.com/profile_images/1593580319109566464/d6LTKixy_400x400.jpg",
          color: 0x00ff00,
          url: "https://jacksta.dev",
        }),
      ],
    });
  },
};

export default test;
