// utils/handleInteractionError.ts
import type { CommandInteraction } from "discord.js";

async function handleInteractionError(interaction: CommandInteraction, error: any): Promise<void> {
  console.error(`Command error:`, error);

  const errorMessage = "Désolé, erreur lors du traitement de la commande.";

  if (interaction.deferred || interaction.replied) {
    await interaction.editReply({ content: errorMessage });
  } else {
    await interaction.reply({ content: errorMessage, ephemeral: true });
  }
}

export default handleInteractionError;
