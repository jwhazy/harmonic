# Harmonic

Harmonic is an simple and easy to use single server Discord audio bot. Built with Bun, discord.js and yt-dlp. After plenty of iterations I am finally pleased with the resulting bot and it's stability.

## Getting started
Make sure you have your bot token saved and [Bun](https://bun.sh/) installed on your machine.

**Providing support for help with setting up or debugging Discord bots themselves is beyond the scope of this project. Sorry!** Please do not open issues related to configuring the Discord bot itself (not Harmonic), getting the bot token or installing/configuring Bun.

1. Clone the repository
```bash
git clone https://github.com/jwhazy/harmonic
```
2. Install dependencies
```bash 
bun i
```
3. Create a `.env` file in the repository root and add the environment variables listed [here](https://github.com/jwhazy/harmonic/blob/main/utils/env.ts)

4. Start the bot
```bash
bun run start
```

5. Having issues? **You're likely missing dependencies.** Run the dependency checker and cross check with the requirements [here](https://discordjs.guide/voice).
```bash
bun run deps
```

## Custom emojis
I've exposed environment variables for custom success, fail and loading emojis. You can use them by following the instructions [here](https://github.com/jwhazy/harmonic/blob/main/utils/env.ts)

![Example of emojis](https://raw.githubusercontent.com/jwhazy/harmonic/refs/heads/main/media/emojis.png)