// utils/handleInteractionError.js
async function handleInteractionError(interaction, error) {
  console.error(`Command error:`, error);
  
  const errorMessage = "Désolé, erreur lors du traitement de la commande.";
  
  if (interaction.deferred || interaction.replied) {
    await interaction.editReply({ content: errorMessage });
  } else {
    await interaction.reply({ content: errorMessage, ephemeral: true });
  }
}

export default handleInteractionError;