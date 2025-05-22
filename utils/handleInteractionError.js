import { MessageFlags } from "discord.js";

export default async function handleInteractionError(interaction, error) {
  console.error(`Error handling command ${interaction.commandName}:`, error);
  
  try {
    const errorMessage = "Sorry, there was an error processing your command.";
    
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral
      });
    }
  } catch (secondaryError) {
    console.error("Failed to send error message:", secondaryError);
  }
}