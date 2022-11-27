import embedCreate from "../utils/embedCreate";

export default function interactionCreate() {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = global.commands.get(interaction.commandName);

    await interaction.deferReply();
    if (!command) {
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "There was an error processing your command.",
            description: "Reason: Command does not exist.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x880808,
          }),
        ],
      });
      return;
    }

    try {
      await command.run(interaction);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "There was an error processing your command.",
            description: "Reason: Command does not exist.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x880808,
          }),
        ],
      });
    }
  });
}
