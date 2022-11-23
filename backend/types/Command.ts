import Eris from "eris";

export type Command = {
  run: (interaction: Eris.CommandInteraction) => void;
} & Eris.ApplicationCommandStructure;

export default Command;
