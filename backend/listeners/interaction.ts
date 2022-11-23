import { CommandInteraction } from "eris";

const handleCommand = async (
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = commands.find((c) => c.name === interaction.data.name);

  await interaction.acknowledge();

  interaction.data;

  if (!slashCommand) {
    interaction.createFollowup("Command not found");
    return;
  }

  slashCommand.run(interaction);
};

export default (): void => {
  client.on("interactionCreate", async (interaction: CommandInteraction) => {
    if (interaction instanceof CommandInteraction) {
      await handleCommand(interaction);
    }
  });
};
