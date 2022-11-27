/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { Client } from "discord.js";
import Command from "./Command";
import Player from "../utils/player";

// I fucking hate using global variables

declare global {
  var client: Client;
  var config: Config;
  var commands: Map<string, Command>;
  var player: Player;
  var token: string;
}
