import { Interaction, CacheType } from "discord.js";
import embedCreate from "./embedCreate";
import { error as errorLog } from "./logger";

// eslint-disable-next-line func-names
export default async function (
  interaction?: Interaction<CacheType>,
  error?: unknown | null,
  title?: string,
  reason?: string
) {
  errorLog(error || reason);

  if (interaction?.isCommand())
    await interaction.editReply({
      embeds: [
        embedCreate({
          title: title || "There was an error!",
          description: `Reason: ${reason || "Unknown error occurred."}`,
          author: "🎶🎶🎶",
          thumbnail:
            `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
            "https://cdn.jacksta.dev/assets/newUser.png",
          color: 0x880808,
        }),
      ],
    });
}
