import type { Command } from "../types";
import { play } from "./play";
import { pause } from "./pause";
import { resume } from "./resume";
import { queue } from "./queue";
import { skip } from "./skip";
import { stop } from "./stop";

const commands = [play, pause, resume, queue, skip, stop];

export const commandData = commands.map((command) => command.data);

export default commands satisfies Command[];
