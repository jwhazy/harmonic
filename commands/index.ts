import type { Command } from "../types";
import ping from "./ping";
import { play } from "./play";
import { pause } from "./pause";
import { queue } from "./queue";

export default [ping, play, pause, queue] satisfies Command[];
