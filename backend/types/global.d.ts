/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import Eris from "eris";
import Player from "../utils/player";
import Command from "./command";

// I fucking hate using global variables

declare global {
  var client: Eris.Client;
  var commands: Command[];
  var config: Config;
  var player: Player;
  var token: string;
}
