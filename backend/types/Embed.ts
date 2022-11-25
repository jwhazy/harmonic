import { APIEmbedField } from "discord.js";

type Embed = {
  title: string;
  description: string;
  author: string;
  image?: string;
  thumbnail?: string;
  color: number;
  fields?: APIEmbedField[];
  url?: string;
};

export default Embed;
