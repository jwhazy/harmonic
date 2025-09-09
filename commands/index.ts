import type { Command } from "../types";
import { play } from "./play";
import { pause } from "./pause";
import { resume } from "./resume";
import { queue } from "./queue";
import { skip } from "./skip";
import { stop } from "./stop";
import { join } from "./join";
import { disconnect } from "./disconnect";
import { nowPlaying } from "./now-playing";

const commands = [
	play,
	pause,
	resume,
	queue,
	skip,
	stop,
	join,
	disconnect,
	nowPlaying,
];

export const commandData = commands.map((command) => command.data);

export default commands satisfies Command[];
