import Eris from "eris";

type Embed = {
  title: string;
  description: string;
  author: string;
  image?: string;
  thumbnail?: string;
  color: number;
  fields?: Eris.EmbedField[];
  url?: string;
};

export default Embed;
