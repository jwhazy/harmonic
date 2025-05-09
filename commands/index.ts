import type { Command } from "../types";
import ping from "./ping";
import { play } from "./play";
import { pause } from "./pause";
import { queue } from "./queue";
import { skip } from "./skip";
import { stop } from "./stop";

export default [ping, play, pause, queue, skip, stop] satisfies Command[];
