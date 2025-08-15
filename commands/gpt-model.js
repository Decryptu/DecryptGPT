// commands/gpt-model.js
import { GPT_MODELS, MODEL_SURNAMES } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";
import { MessageFlags } from "discord.js";

async function gptModel(interaction, client) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const selectedModel = interaction.options.getString("model");
  
  if (!Object.values(GPT_MODELS).includes(selectedModel)) {
    return await interaction.editReply({ content: "Modèle invalide." });
  }

  const previousModel = MODEL_SURNAMES[client.currentModel];
  client.currentModel = selectedModel;
  setBotActivity(client, client.currentModel);

  const newModel = MODEL_SURNAMES[selectedModel];
  console.log(`[MODEL SWITCH] ${interaction.user.username}: ${previousModel} → ${newModel}`);
  
  await interaction.editReply({ content: `Modèle activé: ${newModel}` });
}

export default gptModel;