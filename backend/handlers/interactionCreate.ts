export default function interactionCreate() {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = global.commands.get(interaction.commandName);

    await interaction.deferReply();
    if (!command) {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
      return;
    }

    try {
      await command.run(interaction);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  });
}
