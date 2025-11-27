import type { Command } from "../utils/types";
import { disconnect } from "./disconnect";
import { join } from "./join";
import { nowPlaying } from "./now-playing";
import { pause } from "./pause";
import { play } from "./play";
import { queue } from "./queue";
import { resume } from "./resume";
import { skip } from "./skip";
import { stop } from "./stop";

/**
 * **Adding commands**
 *
 * To add commands, define them in /commands and then import and add them to this array.
 * You will need to manually refresh the commands for production applications by running `bun run commands`.
 */
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
