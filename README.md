# harmonic

Music bot in TypeScript. Extremely basic. Uses discord.js, ffmpeg and play-dl. A version with an API and frontend is available on the `frontend` branch.

**This bot is designed for private & single server use only, it will not work over multiple servers.**

**Please only use this bot if you have experience in JavaScript/Node.js software. Providing help for Node rookies is beyond the scope of this project, sorry.**

## Known issues

- Age/country specific videos crash the bot (or aren't discoverable when searching). **Update:** This has been fixed if you add cookies to your enviroment variables - see .env.example
- YouTube only, support for Spotify is limited (may change later).
- Crashes everywhere. Report them in the Issues tab, with back-trace if possible thanks.

## Get started

Add related enviroment variables in .env (see .env.example). Install packages with `npm i` or `yarn` and run `yarn start` or `npm run start`.
