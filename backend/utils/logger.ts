/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";

export const log = (message: any) =>
  console.log(chalk.blue.bold("[bot]"), chalk.white(`${message}`));

export const error = (message: any) =>
  console.log(chalk.red.bold("[error]"), chalk.white(`${message}`));

export const warn = (message: any) =>
  console.log(chalk.yellow.bold("[warn]"), chalk.white(`${message}`));

export const success = (message: any) =>
  console.log(chalk.green.bold("[success]"), chalk.white(`${message}`));
