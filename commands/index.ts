import type { Command } from "../types";
import { play } from "./play";
import { pause } from "./pause";
import { resume } from "./resume";
import { queue } from "./queue";
import { skip } from "./skip";
import { stop } from "./stop";

export default [play, pause, resume, queue, skip, stop] satisfies Command[];
