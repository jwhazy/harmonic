import { EmbedBuilder } from "discord.js";
import Embed from "../types/Embed";

export default function embedCreate({
  title,
  description,
  author,
  image,
  thumbnail,
  color,
  url,
  fields,
}: Embed) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setURL(url || null)
    .setAuthor({
      name: author,
    })
    .setDescription(description)
    .setThumbnail(thumbnail || null)
    .setImage(image || null)
    .setTimestamp(new Date())
    .setFooter({
      text: global.config.name,
      iconURL:
        `https://cdn.discordapp.com/avatars/${global.client.user?.id}/${global.client.user?.avatar}.png` ||
        undefined,
    });

  if (fields) {
    fields.forEach((field) => {
      embed.addFields(field);
    });
  }

  return embed;
}
