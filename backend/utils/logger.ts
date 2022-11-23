import chalk from "chalk";

export const log = (message: string) =>
  console.log(chalk.blue.bold("[bot]"), chalk.white(`${message}`));

export const error = (message: string) =>
  console.log(chalk.red.bold("[error]"), chalk.white(`${message}`));

export const warn = (message: string) =>
  console.log(chalk.yellow.bold("[warn]"), chalk.white(`${message}`));

export const success = (message: string) =>
  console.log(chalk.green.bold("[success]"), chalk.white(`${message}`));
