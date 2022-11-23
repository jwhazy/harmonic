import { EmbedOptions } from "eris";
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
  const embed: EmbedOptions = {
    title,
    description,
    url,
    timestamp: new Date(),
    color,
    footer: {
      text: config.name,
    },
    image: {
      url: image,
    },
    thumbnail: {
      url: thumbnail,
    },
    fields,
    author: {
      name: author,
    },
  };

  return embed;
}
