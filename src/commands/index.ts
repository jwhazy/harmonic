import Command from "@/types/Command";
import pause from "./pause";
import play from "./play";
import queue from "./queue";
import resume from "./resume";
import skip from "./skip";
import stop from "./stop";

const commands = new Map<string, Command>();

[play, pause, queue, resume, stop, skip].forEach((command) => {
  commands.set(command.data.name, command);
});

export default commands;
